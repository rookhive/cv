import Scene from  '../Scene.js'

class Epilogue extends Scene {
    static getKey() {
        return 'EPILOGUE'
    }

    constructor() {
        super(...arguments)
        this.theme = {
            color: '#dfdfdf'
        }
    }

    rebuild() {
        return () => {
            const messageNode = this.root.querySelector('.epilogue__message')
            if (messageNode) {
                messageNode.innerHTML = this.translations.message
            }
            this.setSceneReady()
        }
    }

    start() {
        return this.runAsyncLoop(
            super.start,
            this.animateMainTitle,
            this.showContent
        )
    }

    async showContent() {
        const $message = U('.epilogue__message')
        const contentNode = U('.epilogue__content')[0]
        const duration = 500
        const totalDuration = 1000

        const messageAnimation = Array.prototype.map.call(
            $message.getAll('.x-p'),
            (p, i, { length }) => A.animateTextByLine(
                p,
                ['opacity|0|1', 'translateY|1rem|0'],
                { duration, easing: 'ease-out' },
                {
                    totalDuration: totalDuration / length,
                    totalDelay: totalDuration / length * i + 150,
                    // retrieveContent: true
                }
            )
        )

        const linksAnimationSettings = Array.prototype.map.call(
            document.querySelectorAll('.epilogue__link'),
            (link, i, { length }) => [
                link,
                { delay: 500 / length * i }
            ]
        )
        
        const linksAnimation = A.animate([
            {
                keyframes: ['opacity|0|1', 'scale|.8|1'],
                timing: { duration: 1000, easing: 'ease-out',
                    delay: totalDuration }
            },
            ...linksAnimationSettings
        ])

        await Promise.all([
            A.animate(contentNode, 'opacity|0|1', { duration: 1500 }),
            ...messageAnimation,
            linksAnimation
        ])
    }

    getMarkup() {
        const { message, thats_all, source, social } = this.translations

        const linksMarkup = [
            {
                icon: 'github',
                url:  '//github.com/rookhive/cv',
                text: source
            },
            {
                icon: 'vk',
                url:  '//vk.com/rookhive',
                text: social
            }
        ]
            .map(({ icon, url, text }) => {
                return `
                    <a href="${url}"
                        class="epilogue__link"
                        target="_blank">
                        <span class="epilogue__link-image">
                            <svg class="icon">
                                <use xlink:href="assets/social.svg#${icon}"/>
                            </svg>
                        </span>
                        <span class="epilogue__link-text">${text}</span>
                    </a>
                `
            })
            .join('')

        return `
            <section class="epilogue">
                <section class="epilogue__content">
                    <h2 class="epilogue__title">${thats_all}</h2>
                    <section class="epilogue__message">${message}</section>
                    <section class="epilogue__links">${linksMarkup}</section>
                </section>
            </section>
        `
    }
}

export default Epilogue