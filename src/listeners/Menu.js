import Listener from '../Listener'
import sceneConfig from '../sceneConfig'

class Menu extends Listener {
    constructor(config) {
        super(config)
        this.state = {}
        this.app = config.app || {}
        this.menuButton = U('.menu-button')[0]
        this.init()
    }

    init() {
        U(this.menuButton).on('mousedown', this.toggleMenu.bind(this))

        this.build()

        U(this.root).on([
            ['click', '[data-scene-action="open"]', (event, node) => {
                const { sceneId } = node.dataset
                this.toggleMenu('close')
                this.app.open(sceneId)
            }],
            ['click', '.menu__button', this.setAppLanguage.bind(this)],
            ['click', this.toggleMenu.bind(this, 'close')]
        ])
    }

    build() {
        const language = T.getLanguage()

        this.root.innerHTML = `
            <div class="menu__content" data-action="close">
                <div class="menu__content-ghost"></div>
                <nav class="menu__scenes">${this.getScenesMarkup()}</nav>
                <section class="menu__buttons">
                    ${
                        [
                            { lang: 'en', desc: 'English' },
                            { lang: 'ru', desc: 'Русский' }
                        ]
                            .map(({ lang, desc }) => {
                                return `
                                    <button class="menu__button
                                        ${language == lang ? 'active' : ''}"
                                        data-language="${lang}">
                                        <span>${desc}</span>
                                    </button>
                                `
                            })
                            .join('')
                    }
                </section>
            </div>
        `
    }

    setAppLanguage(event, button) {
        const { language } = button.dataset

        if (T.getLanguage() == language) {
            event.stopImmediatePropagation()
            return
        }

        T.setLanguage(language)
        this.app.rebuildScene(true)
        this.app.open(this.app.runtime.targetId, true)
        setTimeout(this.build.bind(this), 500)
    }

    toggleMenu(action) {
        const rcl = this.root.classList
        const bcl = this.menuButton.classList
        if (action === 'close') {
            rcl.remove('active')
            bcl.remove('active')
        } else {
            rcl.toggle('active')
            bcl.toggle('active')
        }
    }

    getScenesMarkup() {
        let markup = ''

        !(function parseConfig(config, id = '', isASubscene) {

            config.forEach((sceneObject, i) => {
                const currentId = id + (id ? '-' : '') + i
                const sceneName = T.get(
                    (typeof sceneObject === 'function'
                        ? sceneObject
                        : sceneObject.scene).getKey()
                )

                markup +=
                    `<div
                        class="menu__${isASubscene ? 'sub' : ''}scene-item"
                        data-scene-id="${currentId}"
                        data-scene-action="open"
                    ><span>${sceneName}</span></div>`
                    
                if (typeof sceneObject === 'object'
                    && sceneObject.subscenes) {
                    markup += '<section class="menu__subscene-wrapper">'
                    parseConfig.call(this, sceneObject.subscenes, currentId, true)
                    markup += '</section>'
                }
            })
        }).call(this, sceneConfig)

        return markup
    }

    applyTheme(theme) {
        const spans = U(this.menuButton).getAll('span')
        Array.prototype.forEach.call(spans, span => {
            span.style.background = typeof theme == 'object'
                ? theme.color
                : ''
        })
    }

    async onMessage({ currentId, targetId, theme}) {
        if (this.state.targetId) {
            const cl = this.root
                .querySelector(`[data-scene-id="${this.state.targetId}"]`)
                .classList
            cl.remove('loading')
            cl.remove('active')
        }

        const cl = this.root
            .querySelector(`[data-scene-id="${targetId}"]`).classList

        if (targetId === currentId) {
            cl.remove('loading')
            cl.add('active')
        } else {
            cl.add('loading')
        }
        
        this.state.targetId = targetId
        this.applyTheme(theme)
    }
}

export default Menu