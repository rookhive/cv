class Animation {
    showStoryByLetter(node, settings = {}) {
        const { notParsed } = settings
        if (notParsed) {
            U.parseNodeByLetter(node)
        }
        const lineHeight = U(node).get('.line').offsetHeight
        const storyDeltaY = node.offsetHeight - lineHeight
        const { animation, duration } = this.animateTextByLetter(node, settings)

        return Promise.all([
            ...animation,
            U.breakStack(this.animate, this, node,
                [`translateY|${storyDeltaY}px|0`], { duration })
        ])
    }

    /**
     * Words in the node's text must be wrapped with spans wich have the .word
     * class attribute.
     * @param {HTMLElement} node Node which text content must be animated.
     */
    async animateText(node, pieceClass, animationRules, animationSettings) {
        const { totalDuration, totalDelay, notParsed, retrieveContent }
            = animationSettings
        const savedContent = node.innerHTML
        if (notParsed) {
            U.parseNodeByLetter(node)
        }
        const words = node.querySelectorAll(pieceClass)
        const wordsAnimation = Array.prototype.map.call(
            words, (word, i) => {
                const delay = totalDuration / words.length * i + (totalDelay || 0)
                return [word, { delay }]
            }
        )
        
        await this.animate([
            animationRules,
            ...wordsAnimation
        ])

        if (retrieveContent) {
            node.innerHTML = savedContent
        }
    }

    // Hm-m.. Dependency of U detected :(
    async animateTextByLine(textNode, keyframes = [], timing = {}, settings = {}) {        
        const savedContent = typeof settings.retrieveContent == 'string'
            ? settings.retrieveContent
            : textNode.innerHTML.replace('-', '&#8209;')

        if (!settings.alreadyParsed) {
            textNode.innerHTML = U.splitByWord(textNode.textContent)
            textNode.innerHTML = U.splitByLine(textNode)
        }
        textNode.style.opacity = 1
        
        const lines = U(textNode).getAll('.line')
        const animation = Array.prototype.map.call(
            lines, (line, i) => {
                const delay = (settings.totalDuration || timing.duration) 
                    / lines.length * (
                        settings.reverseOrder
                            ? (lines.length - 1) - i
                            : i
                    ) + (settings.totalDelay || 0)
                return [line, { delay }]
            }
        )
        
        await this.animate([
            { keyframes, timing },
            ...animation
        ])

        if (settings.retrieveContent) {
            if (settings.cssBeforeRetrieving) {
                const css = settings.cssBeforeRetrieving
                for (let property in css) {
                    textNode.style[property] = css[property]
                }
            }
            textNode.innerHTML = savedContent
        }
    }

    animateTextByLetter(node, settings = {}, keyframes = ['opacity|0|1'],
        timing) {
        const { speed = 20, letterDuration = 500, notParsed } = settings
        if (notParsed) {
            U.parseNodeByLetter(node)
        }
        const lines = Array.prototype.slice.call(
            U(node).getAll('.line'))
        let linesTotalDuration = 0
        
        const linesAnimation = lines.map(
            line => {
                const lettersNumber = U(line).getAll('.letter').length
                const totalDelay = linesTotalDuration
                const totalDuration = (1000 / speed) * (lettersNumber - 1)
                    + letterDuration

                linesTotalDuration += totalDuration
                
                return U.breakStack(A.animateText, A, line, '.letter', {
                    keyframes,
                    timing: { duration:
                        letterDuration, easing: 'ease-out', ...timing }
                },  { totalDuration, totalDelay })
            }
        )

        return { animation: linesAnimation, duration: linesTotalDuration }
    }

    // Reversing template:
    // await this.animate(<animation>, 'reverse', { mode: 'sameDirection' })
    animate(animations, order, options) {
        if (order === 'reverse') {
            animations = this.getReversedAnimation(animations, options)
        }

        if (Array.isArray(animations)) {
            let allKeyframes = []
            let allTiming = {}

            animations = animations.map(animation => {
                if (!Array.isArray(animation)) {
                    if (animation.keyframes) {
                        allKeyframes = [ ...allKeyframes, ...animation.keyframes ]
                    }
                    if (animation.timing) {
                        allTiming = Object.assign(allTiming, animation.timing)
                    }
                    return
                }
                let [ node, keyframes, timing = {} ] = animation
                if (!Array.isArray(keyframes)) {
                    if (typeof keyframes == 'object') {
                        timing = keyframes
                    }
                    keyframes = []
                }
                keyframes = [ ...keyframes, ...allKeyframes ]
                timing = Object.assign(timing, allTiming)

                return U.breakStack(this.doAnimation, this, node, keyframes,
                    timing)
            })

            return Promise.all(animations)
        } else {
            return this.doAnimation(...arguments)
        }
    }

    doAnimation(node, keyframes, timing) {
        if (typeof keyframes == 'string') {
            keyframes = keyframes.split()
        }

        if (typeof keyframes[0] == 'string') {
            const from = {}
            const to = {}
            keyframes.map(instruction => {
                let [property, fromValue, toValue] = instruction
                    .split('|')
                    .map(value => value.trim())
                const transformProps = ['translate', 'skew', 'rotate', 
                    'scale', 'matrix', 'perspective']
                
                if (transformProps.find(p => property.startsWith(p))) {
                    fromValue = `${property}(${fromValue})`
                    toValue = `${property}(${toValue})`
                    property = 'transform'
                }

                // For the transform property
                from[property] = (from[property] || '') + ' ' + fromValue
                to[property] = (to[property] || '') + ' ' +  toValue 
            })
            keyframes = [from, to]
        }

        const timingDefault = {
            duration: 1,
            delay: 0,
            easing: 'linear'
        }
        timing = Object.assign({}, timingDefault, timing)
        
        const transitions = []
        const { duration, easing, delay, stopBubbling, dontFireOnChildren }
            = timing
        
        for (let prop in keyframes[0]) {
            transitions.push(`${prop} ${duration}ms ${easing} ${delay}ms`)
            node.style[prop] = keyframes[0][prop]
        }

        return new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    node.style.transition = transitions.join()

                    for (let prop in keyframes[1]) {
                        node.style[prop] = keyframes[1][prop]
                    }

                    node.addEventListener('transitioncancel', () => {
                        event.stopPropagation()
                    })
                    node.addEventListener('transitionend', event => {
                        this.animationEndHandler(resolve, event, node,
                            dontFireOnChildren, stopBubbling)
                    }, { once: !dontFireOnChildren })
                })
            })
        })
    }

    animationEndHandler(resolve, event, node, dontFireOnChildren, stopBubbling) {
        stopBubbling && event.stopPropagation()
        if (event.target == node) {
            node.style.transition = ''
        } else if (dontFireOnChildren) return
        resolve()
    }
    
    getReversedAnimation(animations, options) {
        const processKeyframe = keyframe => {
            const d = '|'
            const parsed = keyframe.split(d)
            ;[ parsed[1], parsed[2] ] = [ parsed[2], parsed[1] ]
            const to = parsed[2]
            if (options && options.mode == 'sameDirection' && to.endsWith('px')) {
                parsed[2] = to.startsWith('-')
                    ? to.subsstring(1)
                    : '-' + to
            }
            return parsed.join(d)
        }

        return animations.map(animation => {
            if (Array.isArray(animation) && animation[1]) {
                animation[1] = animation[1].map(processKeyframe)
            } else if (animation.keyframes) {
                animation.keyframes = animation.keyframes.map(processKeyframe)
            }
            return animation
        })
    }
}

export default Animation