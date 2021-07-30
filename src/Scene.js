class Scene {
    constructor(app) {
        this.app = app
        this.translations = this.getTranslations()
        const sceneNode = document.createElement('section')
        sceneNode.className = 'scene'
        sceneNode.innerHTML = this.getMarkup()
        this.root = sceneNode
        this.$root = U(sceneNode)
        this.state = 'mounted'
    }

    async runAsyncLoop(...actions) {
        while (actions.length) {
            const action = actions.shift()
            await U.breakStack(this.getPromiseByAction, this, action)
            if (this.isDead()) {
                return
            }
        }
    }

    ctx(func, context, ...args) {
        return { func: context[func], context, args }
    }

    getPromiseByAction(action) {
        switch (typeof action) {
            case 'function':
                return action.call(this)

            case 'object':
                return Array.isArray(action)
                    ? Promise.all(action.map(action => {
                        return this.getPromiseByAction(action)
                    }))
                    : action.func.apply(action.context, action.args)

            default:
                return Promise.resolve()
        }
    }

    isDead() {
        return !this.state || this.state == 'closing'
    }

    startAlreadyMounted() {
        __DEV__ && console.warn(`Start already mounted scene: ${this.getName()}`)
    }

    async open() {
        this.$root.addClass('pointer-events-none')
        this.state = 'opening'
        await this.start()
        this.state = 'pending'
        this.setSceneReady()
    }

    async close() {
        this.$root.addClass('pointer-events-none')
        this.state = 'closing'
        await this.finish()
        this.root.remove()
        delete this.state
    }

    async abort() {
        U(this.root).addClass('pointer-events-none')
        this.state = 'closing'
        await this.crash()
        this.root.remove()
        delete this.state
    }

    async start() {
        await this.fadeScene('in', 500)
    }

    async finish() {
        if (this.isSceneVisible()) {
            await this.fadeScene('out', 500)
        }
    }

    async crash() {
        if (this.isSceneVisible()) {
            await this.fadeScene('out', 500)
        }
    }

    setSceneReady() {
        this.$root.removeClass('pointer-events-none')
        this.root.children[0].classList.add('ready')
    }

    isSceneVisible() {
        return getComputedStyle(this.root).opacity == 1
    }

    rebuild() {}

    // 'I am {sex:a man}!'
    // -> 'I am <span class="x-sex">a man</span>!'
    // Use "x-*" mask to prevent classname's duplicating.
    parseTranslation(text) {
        let matches
        const exp = /{([0-9a-zA-Z\-]+):([^{}]+)}/gi

        while (matches = exp.exec(text)) {
            const marchesExp = matches[0]
                .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
            const content = `<span class="x-${matches[1]}">${matches[2]}</span>`
            text = text.replace(
                new RegExp(marchesExp, 'gi'), content)
        }

        return text
    }

    getTranslations(prefix) {
        prefix = prefix || this.constructor.getKey()
        const translations = T.getAllStartingWith(prefix)
        const result = {}

        for (let key in translations) {
            result[(key.substring(prefix.length + 1)).toLowerCase()]
                = this.parseTranslation(
                    translations[key]
                        .replace('-', '&#8209;')
                        .replace(/[\s]+/g, ' '))
        }
        result.name = result[prefix.toLowerCase()] = T.get(prefix)

        return result
    }

    fadeScene(direction, duration) {
        if (!duration) {
            this.root.style.opacity = direction == 'in' ? 1 : 0
            return
        }
        const animation = [
            [this.root, ['opacity|0|1'], {
                duration, dontFireOnChildren: true }]
        ]
        return A.animate(animation, direction == 'out' ? 'reverse' : null)
    }

    async animateTitle(title, settings = {}) {
        const { animation, pending, duration, css } = Object.assign({}, {
            duration: 1000,
            pending: 0,
            css: {}
        }, settings)

        title = title || this.translations.name
        const titleNode = document.createElement('div')
        titleNode.className = 'scene__title'
        titleNode.innerHTML = title

        for (let prop in css) {
            titleNode.style[prop] = css[prop]
        }

        titleNode.style.color = css.color || (this.theme || {}).color || ''
        this.root.children[0].appendChild(titleNode)

        const getAnimation = keyframes => [
            { timing: { duration }},
            [titleNode, [...keyframes]]
        ]
        
        let animations
        switch (animation) {
            case 'opacity':
                animations = [
                    // Too hardcore animation for most browsers
                    ['opacity|0|1'], // 'filter|blur(10px)|blur(0)'],
                    ['opacity|1|0'] //, 'filter|blur(0)|blur(10px)']
                ]
                break
            default:
                animations = [
                    ['opacity|0|1', 'translate|-30%,-50%|-50%,-50%'],
                    ['opacity|1|0', 'translate|-50%,-50%|-70%,-50%']
                ]
        }
        
        for (let i = 0; i < animations.length; i++) {
            await A.animate(getAnimation(animations[i]))
            if (!i) await U.wait(pending)
            if (this.isDead())
                return
        }

        titleNode.remove()
    }

    async animateMainTitle() {
        await this.animateTitle(this.translations.name, {
            animation: 'opacity',
            duration: 750,
            pending:  500,
            css: {
                fontSize: '2rem',
                textTransform: 'uppercase'
            }
        })
    }

    async startChapter() {
        await this.animateMainTitle()
        
        if (this.isDead())
            return

        const { currentId, targetId } = this.app.runtime
        if (currentId === targetId) {
            this.app.openNextScene()
        }
    }

    getName() {
        return T.get(this.constructor.getKey())
    }

    getMarkup() {
        __DEV__ && console.warn('There is no markup for ', this.getName())
        return ''
    }
}

export default Scene