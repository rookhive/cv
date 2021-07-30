import Scene from  '../Scene'

class NonCommercialExperience extends Scene {
    static getKey() {
        return 'NON_COMMERCIAL_EXPERIENCE'
    }

    constructor() {
        super(...arguments)
        this.theme = { color: '#ddd' }

        ;['content', 'title', 'intro', 'list', 'outro', 'next'].forEach(
            part => {
                this[part + 'Node']
                    = this.$root.get('.self-experience__' + part)
            })
    }

    rebuild() {
        return () => {
            ;['intro', 'outro'].forEach(prefix => {
                const node = this[prefix + 'Node']
                node.innerHTML = this.translations[prefix]
            })
        }
    }

    async start() {
        await this.runAsyncLoop(
            super.start,
            this.animateTitle,
            this.showInterface
        )

        this.$root
            .findOne('.self-experience__next-button')
            .on('click', this.app.openNextScene)
    }

    async showInterface() {
        const { introNode, listNode, outroNode, nextNode } = this
        const delay = 300

        const titleAnimation = [this.titleNode, ['opacity|0|1', 'translateY|2rem|0'], {
            duration: 500 }]

        const introAnimation = this.textAnimation(introNode, delay)

        const listAnimation = [
            {
                keyframes: ['opacity|0|1', 'scale|0|1'],
                timing: {
                    duration: 1000,
                    easing: 'ease-out'
                }
            },
            ...Array.prototype.map.call(
                U(listNode).getAll('li'),
                (li, i, { length }) => {
                    return [
                        li, { delay: delay * 3 + 1000 / length * i }
                    ]
                }
            )
        ]

        const outroAnimation = this.textAnimation(outroNode, delay * 7)

        const nextButtonAnimation = [nextNode, ['opacity|0|1', 'scale|.5|1'], {
            duration: 1000, delay: delay * 9 }]

        listNode.style.opacity = 1

        await A.animate([
            titleAnimation,
            introAnimation,
            outroAnimation,
            nextButtonAnimation,
            ...listAnimation
        ])

        U(this.titleNode).addClass('ready')
    }

    textAnimation(node, delay) {
        return A.animateTextByLine(
            node,
            ['opacity|0|1', 'translateY|1rem|0'],
            { duration: 500, easing: 'ease-out' },
            {
                totalDuration: 500,
                totalDelay: delay,
                retrieveContent: false
            }
        )
    }

    getMarkup() {
        const { name, intro, list, outro } = this.translations
        const next = T.get('NEXT')
        const parsedList = U.splitText(list, ['|'])
        const listMarkup = U.getGridMarkup(parsedList, 3)

        return `
            <div class="self-experience about__subscene">
                <section class="self-experience__content">
                    <section class="self-experience__projects">
                        <h2 class="self-experience__title">${name}</h2>
                        <p class="self-experience__intro">${intro}</p>
                        <section class="self-experience__list">
                            ${listMarkup}
                        </section>
                        <p class="self-experience__outro">${outro}</p>
                        <section class="self-experience__next">
                            <button class="self-experience__next-button
                                blinking">
                                <span>${next}</span>
                            </button>
                        </section>
                    </section>
                </section>
            </div>
        `
    }
}

export default NonCommercialExperience