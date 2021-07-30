require('dotenv').config()

const fs = require('fs')
const path = require('path')

const redisClient = require('../../redisClient')
const { promisify } = require('util')
const nodemailer = require('nodemailer')
const uuid = require('uuid')
const md5 = require('md5')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const redisSetexAsync = promisify(redisClient.setex).bind(redisClient)

const smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})
smtpTransporter.verify(error => {
    if (error) {
        throw new Error('Could not connect to SMTP server.')
    }
})

const User = require('../../models/User')

const sendActivationCode = ({ email, activationCode }) => {
    try {
        const host = process.env.HOST
        const from = `activation@${host}`
        const subject = 'Подтверждение аккаунта на сайте SITENAME'
        const html = fs
                .readFileSync(path.resolve(__dirname,
                    '../../templates/email/account-activation.html'), 'utf8')
                .replace(/%activationLink%/g,
                    `${process.env.PROTOCOL}://${host}/account/activate/${
                        activationCode}`)
        return smtpTransporter.sendMail({
            from,
            to: email,
            subject,
            html
        })
    } catch (error) {
        throw error
    }
}

const getFingerprint = request => {
    return md5(request.headers['user-agent']
        + request.connection.remoteAddress.toString())
}

const generateTokens = async (user, request) => {
    const accessTokenExpiresAt = Math.floor(Date.now() / 1000)
        + +process.env.JWT_ACCESS_TTL
    const tokens = await Promise.all([
        jwt.sign(
            {
                userId: user.id,
                roles: user.roles,
                exp: accessTokenExpiresAt
            },
            process.env.JWT_ACCESS_SALT
        ),
        jwt.sign(
            {
                userId: user.id,
                hash: getFingerprint(request)
            },
            process.env.JWT_REFRESH_SALT + user.password,
            { expiresIn: process.env.JWT_REFRESH_TTL }
        )
    ])
    return {
        accessTokenExpiresAt,
        accessToken: tokens[0],
        refreshToken: tokens[1]
    }
}

const transformRefreshTokens = (refreshTokensArray, newRefreshToken,
    userFingerprint) => {
    const sameOriginRefreshTokenIndex = refreshTokensArray.findIndex(token => {
        const decodedToken = jwt.decode(token)
        return decodedToken.hash && decodedToken.hash === userFingerprint
    })
    if (sameOriginRefreshTokenIndex > -1) {
        refreshTokensArray.splice(sameOriginRefreshTokenIndex, 1,
            newRefreshToken)
    } else {
        refreshTokensArray.push(newRefreshToken)
    }
    return refreshTokensArray
}

module.exports = {
    /** Mutations **/
    createUser: async ({ userInput: input }) => {
        try {
            // TODO: Use transactions to avoid incorrect data saving
            const isEmailAlreadyExist = await User.findOne({
                email: input.email
            })
            if (isEmailAlreadyExist) throw new Error('Email exists already.')
            const isUserNicknameAlreadyExist = await User.findOne({
                nickname: input.nickname
            })
            if (isUserNicknameAlreadyExist)
                throw new Error('Nickname exists already.')
            if (input.password !== input.passwordRepeat) {
                throw new Error('Passwords do not match.')
            }
            const hashedPassword = await bcrypt.hash(input.password, 12)
            const activationCode = uuid()
            const user = new User({
                email: input.email,
                password: hashedPassword,
                nickname: input.nickname,
                roles: ['user'],
                activationCode
            })
            const isEmailSent = await sendActivationCode(user)
            if (!isEmailSent) {
                throw new Error('Failed to send email.')
            }
            const savedUser = await user.save()
            return {
                ...savedUser._doc,
                password: null
            }
        } catch (error) {
            throw error
        }
    },
    activateAccount: async ({ activationCode }) => {
        try {
            const user = await User.findOne({ activationCode })
            if (!user) throw new Error('Activation error.')
            user.activationCode = undefined
            user.isActivated = true
            const updatedUser = await user.save()
            if (!updatedUser) throw new Error('Activation error.')
            return {
                ...updatedUser._doc,
                password: null
            }
        } catch (error) {
            throw error
        }
    },
    login: async ({ email, password }, req) => {
        try {
            if (req.isAuthorized) throw new Error('Incorrect login.')
            if (!email || !password) throw new Error('Incorrect login.')
            const userFingerprint = getFingerprint(req)
            const user = await User.findOne({ email })
            if (!user) throw new Error('Incorrect login.')
            const isPasswordCorrect = await bcrypt.compare(password,
                user.password)
            if (!isPasswordCorrect) throw new Error('Incorrect login.')
            if (!user.isActivated) throw new Error('Account is not activated.')
            const authData = await generateTokens(user, req)
            transformRefreshTokens(user.refreshTokens, authData.refreshToken,
                userFingerprint)
            const savedUser = await user.save()
            if (!savedUser) throw new Error('Server error.')
            return {
                ...authData,
                userId:        user.id,
                userEmail:     user.email,
                userNickname:  user.nickname,
                userAvatar:    user.avatar,
                userRoles:     user.roles
            }
        } catch (error) {
            throw error
        }
    },
    logout: async ({}, req) => {
        try {
            if (!req.isAuthorized) return false
            const { userId } = req
            const userFingerprint = getFingerprint(req)
            const user = await User.findById(userId)
            if (!user) throw new Error('User is not found.')
            const sameOriginRefreshTokenIndex
                = user.refreshTokens.findIndex(refreshToken => {
                    const decodedToken = jwt.decode(refreshToken)
                    return decodedToken.hash && decodedToken.hash
                        === userFingerprint
                })
            if (sameOriginRefreshTokenIndex > -1) {
                user.refreshTokens.splice(sameOriginRefreshTokenIndex, 1)
            }
            const savedUser = await user.save()
            if (!savedUser) throw new Error('Failed to save updated user data.')
            const redisTokenKey = `token:${req.accessToken}`
            const redisTokenKeyExpiresIn = req.decodedAccessToken.exp
                - parseInt(Date.now() / 1000)
            const setexResult = await redisSetexAsync(redisTokenKey,
                redisTokenKeyExpiresIn, 1)
            return setexResult === 'OK'
        } catch (error) {
            throw error
        }
    },
    refreshTokens: async ({ token }, req) => {
        let user
        try {
            if (!token) throw new Error('Invalid token.')
            const userFingerprint = getFingerprint(req)
            const decodedToken = jwt.decode(token)
            if (!decodedToken) throw new Error('Invalid token.')
            const { userId } = decodedToken
            user = await User.findById(userId)
            if (!user) throw new Error('Server error.')
            jwt.verify(token, process.env.JWT_REFRESH_SALT + user.password)
            const isTokenInAWhiteList = user.refreshTokens.includes(token)
            if (!isTokenInAWhiteList) throw new Error('Invalid token.')
            const authData = await generateTokens(user, req)
            transformRefreshTokens(user.refreshTokens, authData.refreshToken,
                userFingerprint)
            const savedUser = await user.save()
            if (!savedUser) throw new Error('Server error.')
            return {
                ...authData,
                userId:        user.id,
                userEmail:     user.email,
                userNickname:  user.nickname,
                userAvatar: user.avatar,
                userRoles:     user.roles
            }
        } catch (error) {
            if (error.message === 'jwt expired') {
                const isTokenInAWhiteList = user.refreshTokens.includes(token)
                if (isTokenInAWhiteList) {
                    user.refreshTokens.pull(token)
                    await user.save()
                }
            }
            throw error
        }
    },
    /** Queries **/
    getUser: async ({ id }) => {
        try {
            const user = await User.findById(id)
            if (!user) throw new Error('Server error.')
            return {
                ...user._doc,
                email: user.showEmail ? user.email : null,
                password: null
            }
        } catch (error) {
            throw error
        }
    }
}