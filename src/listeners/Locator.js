import Listener from '../Listener'

class Locator extends Listener {
    constructor(config) {
        super(config)
        this.init()
        this.app = config.app || {}
        this.sceneNames = {}
        
        const root = U(this.root)
        this.locator = root.get('.locator')
        this.numberNode = root.get('.locator__number')
        this.nameNode = root.get('.locator__name')
    }

    init() {
        this.root.innerHTML = `
            <div class="locator">
                <div class="locator__number"></div>
                <div class="locator__name"></div>
            </div>
        `
    }

    // '01' -> '<span>0</span><span>1</span>'
    wrap(value) {
        return value.split('').map(char => {
            if (char == ' ') char = '&nbsp;'
            return `<span>${char}</span>`
        }).join('')
    }

    async animate(parentNode, newValue) {
        if (!parentNode.textContent)
            parentNode.innerHTML = '&nbsp;'.repeat(newValue.length)
        const currentValue = parentNode.textContent

        if (newValue.replace(/\s/g, '') === currentValue.replace(/\s/g, '')) {
            return
        }

        const shadowSpan = parentNode.cloneNode()
        shadowSpan.style.visibility = 'hidden'
        shadowSpan.innerHTML = this.wrap(newValue)
        document.body.appendChild(shadowSpan)

        const parentNodeHeight = parentNode.clientHeight - 3
        parentNode.innerHTML = this.wrap(currentValue)

        const oldSpans = parentNode.querySelectorAll('span')
        const shadowSpans = shadowSpan.querySelectorAll('span')

        const animations = [{
            timing: {
                duration: 750
            }
        }]

        for (
            let diffIndex = U.getFirstDifferentIndex(newValue, currentValue),
                length = Math.max(newValue.length, currentValue.length);
            diffIndex < length;
            diffIndex++
        ) {
            let span
            if (diffIndex < currentValue.length) {
                span = oldSpans[diffIndex]

                Object.assign(span.style, {
                    position: 'relative',
                    display: 'inline-block'
                })

                animations.push([
                    span,
                    [
                        `translateY|0|-${parentNodeHeight}px`,
                        'opacity|1|0'
                    ]
                ])
            }

            let newSpan
            if (newValue[diffIndex] != undefined) {
                const shadowSpanOffset =  
                    shadowSpans[diffIndex].getBoundingClientRect().left
                newSpan = document.createElement('span')

                Object.assign(newSpan.style, {
                    display: 'inline-block',
                    position: 'absolute',
                    left: shadowSpanOffset + 'px',
                    opacity: 0
                })

                newSpan.innerHTML = newValue[diffIndex] == ' '
                    ? '&nbsp;'
                    : newValue[diffIndex]
                parentNode.appendChild(newSpan)

                animations.push([
                    newSpan,
                    [
                        `translateY|${parentNodeHeight}px|0`,
                        'opacity|0|1'
                    ]
                ])
            }
        }

        shadowSpan.remove()
        await A.animate(animations)
        parentNode.innerHTML = newValue.replace(' ', '&nbsp;')
    }

    prettifyId(id) {
        id = +id.split('-')[0] + 1
        return (id < 10 ? '0' : '') + id
    }

    toggleLocator(action) {
        const cl = this.locator.classList
        switch (action) {
            case 'loading':
                cl.add('loading')
                break
            case 'completed':
                cl.remove('loading')
                break
        }
    }

    applyTheme(theme) {
        this.locator.style.color = theme
            ? theme.color
            : ''
    }

    async onMessage({ currentId, targetId, theme }) {
        const mainSceneId = targetId.split('-')[0]
        
        this.applyTheme(theme)

        if (currentId === targetId) {
            this.toggleLocator('completed')
            const prettifiedId = this.prettifyId(mainSceneId)
            const sceneKey
                = this.app.getKeyById(mainSceneId)
            const sceneName = T.get(sceneKey)
            await Promise.all([
                this.animate(this.numberNode, prettifiedId),
                this.animate(this.nameNode, sceneName)
            ])
            return
        }

        if (mainSceneId !== currentId)
            this.toggleLocator('loading')
    }
}

export default Locator