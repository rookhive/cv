import Scene from  '../Scene'

class Reasons extends Scene {
    static getKey() {
        return 'REASONS'
    }

    constructor() {
        super(...arguments)
        this.theme = {
            color: '#dfdfdf'
        }
        this.activity = {}
        this.slidesData = this.getSlidesData([ 'you', 'i' ])
        this.mountSlides()
        this.bindedOpenNextScene = this.openNextScene.bind(this)
    }

    rebuild() {
        return () => {
            this.root.innerHTML = this.getMarkup()
            this.mountSlides()
            const { openedId } = this.activity
            this.activity = {
                openedId
            }
            this.runAsyncLoop(
                this.openSlide.bind(this, openedId || 0),
                this.addControlHandlers
            )
        }
    }

    start() {
        return this.runAsyncLoop(
            super.start,
            this.animateMainTitle,
            this.openSlide.bind(this, 0),
            this.addControlHandlers
        )
    }

    async finish() {
        const { openedSlide, inWork } = this.activity

        if (openedSlide && !inWork) {
            const controls = this.$root.get('.reasons__controls')
            const $nextButton = U(controls).findOne('[data-direction="next"]')
            $nextButton.removeClass('blinking')
            A.animate(controls, ['opacity|1|0'], { duration: 300,
                easing: 'ease-in' })

            await this.hidePreviousSlide(openedSlide)
        }

        return super.finish()
    }

    getSlidesData(keys) {
        return keys.map(key => ({
            title: this.translations[key],
            content: this.parseTranslation(
                this.translations[key + '_content']
            )
        }))
    }

    mountSlides() {
        const slidesNode = this.$root.get('.reasons__slides')

        this.slidesData.forEach(({ title, content }, i) => {
            const slideNode = document.createElement('div')
            slideNode.className = 'reasons__slide'
            slideNode.setAttribute('data-id', i)
            slideNode.innerHTML = `
                <div class="reasons__title">${title}</div>
                <div class="reasons__content">
                    ${this.parseTranslation(content)}
                </div>
            `
            slidesNode.appendChild(slideNode)
        })
    }

    async openSlide(id) {
        if (this.activity.inWork) {
            return
        }
        this.activity.inWork = true
        this.$root.addClass('pointer-events-none')
        const slidesNode = this.$root.findOne('.reasons__slides')
        const prevSlide = this.activity.openedSlide
        const newSlide = slidesNode.get(`.reasons__slide[data-id="${id}"]`)

        this.activity.openedId = id

        const duration = 500
        const totalDuration = 500

        const controls = this.$root.get('.reasons__controls')
        const $nextButton = U(controls).findOne('[data-direction="next"]')
        const lastSlide = id + 1 == this.slidesData.length

        $nextButton.removeClass('blinking')
        A.animate(controls, ['opacity|1|0'], { duration: 300,
            easing: 'ease-in' })

        if (prevSlide) {
            await this.hidePreviousSlide(prevSlide)
        }

        this.activity.openedSlide = newSlide
        slidesNode[0].style.height = newSlide.offsetHeight + 'px'
        newSlide.classList.add('active')
        newSlide.classList.add('mounting')

        this.highlightControls(id)

        const newTitle = newSlide.querySelector('.reasons__title')
        if (newTitle) {
            A.animate(newTitle,
                ['opacity|0|1'], { duration: 500, easing: 'ease-out' })
        }

        newSlide.classList.add('marked')

        const newSpans = newSlide.querySelectorAll('.x-li')
        
        const newAnimations = newSpans.length
            ? Array.prototype.slice.call(newSpans)
                .map((span, i, { length }) => {
                    return A.animateTextByLine(
                        span,
                        ['opacity|0|1', 'scale|.75|1'],
                        { duration, easing: 'ease-out' },
                        {
                            totalDuration: totalDuration / length,
                            totalDelay: totalDuration / length * i + 150,
                            retrieveContent: true
                        }
                    )
                })     
            : []   

        const controlsDelay = newSpans.length
            ? newSpans.length * (totalDuration / newSpans.length + 150)
            : 0

        await Promise.all([
            ...newAnimations,
            A.animate(controls,
                ['opacity|0|1', 'scale|.75|1'],
                { duration: 300, easing: 'ease-out', delay: controlsDelay })
        ])

        newSlide.classList.remove('mounting')

        if (controls) {
            $nextButton.addClass('blinking')
            $nextButton[0][(lastSlide ? 'add' : 'remove') + 'EventListener']
                ('mousedown', this.bindedOpenNextScene, { once: true })
        }

        this.$root.removeClass('pointer-events-none')
        delete this.activity.inWork
    }

    async hidePreviousSlide(prevSlide, duration = 500, totalDuration = 500) {
        const prevSpans = prevSlide.querySelectorAll('.x-li')
        prevSlide.classList.remove('marked')

        if (prevSpans.length) {
            const prevAnimations = Array.prototype.slice.call(prevSpans)
                .reverse()
                .map((span, i, { length }) => {
                    return A.animateTextByLine(
                        span,
                        ['opacity|1|0'],
                        { duration, easing: 'ease-in' },
                        {
                            reverseOrder: true,
                            totalDuration: totalDuration / length,
                            totalDelay: totalDuration / length * i + 150,
                            retrieveContent: true,
                            cssBeforeRetrieving: {
                                opacity: 0
                            }
                        }
                    )
                })
    
            await Promise.all([
                ...prevAnimations,
                A.animate(prevSlide.querySelector('.reasons__title'),
                    ['opacity|1|0'], { duration: 500, easing: 'ease-in', delay:
                    prevSpans.length * (totalDuration / prevSpans.length + 150) })
            ])
        }

        if (prevSlide) {
            prevSlide.classList.remove('active')
        }
    }

    openNextScene(event) {
        event.stopImmediatePropagation()
        this.app.openNextScene()
    }

    addControlHandlers() {
        this.$root.on([
            ['click', '.reasons__controls-button', (event, node) => {
                const { openedId } = this.activity
                const nextId = node.dataset.direction == 'next'
                    ? openedId + 1
                    : openedId - 1

                if (nextId < 0 || nextId >= this.slidesData.length)
                    return

                this.openSlide(nextId)
            }]
        ])
    }

    highlightControls(id) {
        const [ $previousButton, $nextButton ] = ['previous', 'next']
            .map(action => {
                return U(`[data-direction="${action}"]`)
            })

        $previousButton.removeClass('disabled')
        $nextButton.removeClass('disabled')

        if (!id) {
            $previousButton.addClass('disabled')
        }
    }

    getMarkup() {
        return `
            <section class="reasons">
                <div class="reasons__slides"></div>
                <div class="reasons__controls">
                    <div>
                        <button class="reasons__controls-button"
                            data-direction="previous">
                            <svg class="icon">
                                <use xlink:href="assets/icons.svg#previous"/>
                            </svg>
                        </button>
                        <button class="reasons__controls-button"
                            data-direction="next">
                            <svg class="icon">
                                <use xlink:href="assets/icons.svg#next"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
        `
    }
}

export default Reasons