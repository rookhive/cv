import Scene from  '../Scene'

class Skills extends Scene {
    static getKey() {
        return 'SKILLS'
    }

    constructor() {
        super(...arguments)
        this.theme = {
            color: '#dfdfdf'
        }
        const { oop, lay } = this.getTranslations('TECH_TITLE')

        this.technologies = {
            FRONTEND: {
                JS:    'JavaScript',
                DOM:   'DOM',
                CSS:   'CSS',
                LAY:   lay,
                PSD:   'Photoshop',
                REACT: 'React',
                REDUX: 'Redux',
                WEXT:  'Web Extensions',
                WANIM: 'Web Animations',
                SVG:   'SVG',
                SASS:  'SASS/LESS',
                UIX:   'UI/UX',
                JQRY:  'jQuery'
            },

            BACKEND: {
                NODE: 'Nodejs',
                GRQL: 'GraphQL',
                REST: 'REST',
                HTTP: 'HTTP',
                SQL:  'SQL',
                JWT:  'JWT'
            },

            OTHER: {
                OOP:  oop,
                BUND: 'Bundlers',
                GIT:  'GIT',
                ENG:  'English'
            },
        }
        this.activity = {}

        this.categoriesNode = this.$root.get('.skills__categories')
        this.viewerNode     = this.$root.get('.skills__viewer')
        
        this.$root.findOne('.skills__next')
            .on('click', this.app.openNextScene)

        this.mountTechs()
    }

    rebuild() {
        return () => {
            U('.skills__techs').nodes.forEach(section => {
                this.hideScrollbar(section.children[0])
            })

            const detailsNode = U('.skills__details')
            if (!detailsNode.length) {
                return
            }
            detailsNode[0].remove()

            const { shownTech } = this.activity
            this.showTechDetails({
                target: document.querySelector(`button[data-tech="${shownTech}"]`)
            })
        }
    }

    async start() {
        return this.runAsyncLoop(
            super.start,
            this.animateMainTitle,
            this.showInterface,
            this.showGreetingMessage
        )
    }

    async showInterface() {
        this.root.querySelector('.skills__interface').classList.add('ready')
        
        const { $root } = this
        const duration = 500
        const totalDuration = 1000

        const categoryButtons = $root.get('.skills__categories')
        const techButtons = $root.getAll('.skills__techs.active button')
        const nextButton = $root.get('.skills__next')

        const animations = Array.prototype.map.call(
            techButtons, (button, i, { length }) => {
                return [button, { delay: totalDuration / length * i }]
            })

        await A.animate([
            { keyframes: ['opacity|0|1'], timing: { totalDuration } },
            [categoryButtons],
            { keyframes: ['translateY|2rem|0'], timing: { duration } },
            ...animations,
            { keyframes: ['scale|0|1'], timing: { delay: totalDuration } },
            [nextButton]
        ])

        U('.skills__techs').addClass('ready')
    }

    showGreetingMessage() {
        const { greeting } = this.translations
        const ok = T.get('OK')

        const messageNode = document.createElement('div')
        messageNode.className = 'skills__greeting'
        messageNode.innerHTML = `
            <div class="skills__greeting-content">
                <section class="skills__greeting-message">${greeting}</section>
                <section class="skills__greeting-close blinking
                    blinking_light">${ok}</section>
            </div>
        `
        this.viewerNode.appendChild(messageNode)
        messageNode.style.opacity = 0
        A.animate(messageNode, ['opacity|0|1', 'translateY|1rem|0'],
            { duration: 500 })

        messageNode.querySelector('.skills__greeting-close')
            .addEventListener('click', async () => {
                await A.animate(messageNode, ['opacity|1|0',
                    'translateY|0|-1rem'], { duration: 500 })
                messageNode.remove()
            }, { once: true })
    }

    mountTechs() {
        const { viewerNode, categoriesNode } = this

        let i = 0
        for (let category in this.technologies) {
            const categories = this.technologies[category]
            i++

            const buttonNode = document.createElement('button')
            buttonNode.className = 'skills__category-button'
            buttonNode.setAttribute('data-id', i)
            buttonNode.innerHTML = T.get('TECH_' + category)
            categoriesNode.appendChild(buttonNode)
            
            const section = Object.keys(categories)
            const technologies = section
                .map(technology =>
                    `<button data-tech="${technology}">
                        ${categories[technology]}</button>`)
                .join('')
            const techNode = document.createElement('div')
            techNode.className = 'skills__techs'
            techNode.setAttribute('data-id', i)
            techNode.innerHTML = `<div><div>${technologies}</div></div>`
            viewerNode.appendChild(techNode)
            this.hideScrollbar(techNode.children[0])
        }

        U(categoriesNode).on([
            ['click', '.skills__category-button', this.openSection.bind(this)]
        ])

        U(viewerNode).on([
            ['click', 'button', this.showTechDetails.bind(this)]
        ])

        // Event triggering on the button works in iOS 9.3 neither with
        // dispatchEvent nor with HTMLElement.click. Don't know why.
        this.openSection({
            target: categoriesNode.children[0]
        })
    }

    hideScrollbar(node) {
        const { style } = node
        const scrollbarWidth = U.getScrollbarWidth()
        style.marginRight = `-${scrollbarWidth}px`
        style.width = `calc(100% + ${scrollbarWidth}px)`
    }

    openSection(event) {
        const buttonNode = event.target
        const { id } = buttonNode.dataset
        const prevId = this.activity.openedCategoryId

        if (id == prevId) {
            return
        }

        const newViewerNode  = this.$root.get(`.skills__techs[data-id="${id}"]`)
        const prevViewerNode = this.activity.openedSection
        this.activity.openedCategoryId = id

        U.setActive(this.activity, buttonNode, 'openedButton')
        U.setActive(this.activity, newViewerNode, 'openedSection')

        const translate = [-100, 100]
        if (prevId > id) {
            translate.reverse()
        }

        const animations = [
            { timing: { duration: 300, easing: 'ease-in-out' } },
            [newViewerNode,  ['opacity|0|1', 'visibility|hidden|visible',
                `translateX|${translate[1]}px|0`]]
        ]

        if (prevViewerNode) {
            animations.push(
                [prevViewerNode, ['opacity|1|0', 'visibility|visible|hidden',
                    `translateX|0|${translate[0]}px`]])
        }

        A.animate(animations)
    }

    async showTechDetails({ target }) {
        const { viewerNode } = this
        const buttonNode = target
        if (!buttonNode) {
            return
        }
        const { tech } = buttonNode.dataset
        const detailsDescription = this.parseTranslation(
            T.get('TECH_' + tech))

        this.activity.shownTech = tech
            
        const detailsNode = document.createElement('div')
        detailsNode.className = 'skills__details'
        detailsNode.innerHTML = `
            <div class="skills__details-content">
                <div class="skills__details-wrapper">
                    <header class="skills__details-header">
                        <h2 class="skills__details-title">
                            ${buttonNode.textContent}</h2>
                        <div class="skills__details-close">
                            <button>
                                <svg class="icon">
                                    <use xlink:href="assets/icons.svg#close"/>
                                </svg>
                            </button>
                        </div>
                    </header>
                    <p class="skills__details-description">${detailsDescription}</p>
                </div>
            </div>
        `

        buttonNode.classList.add('active')
        this.activity.openedSection.classList.add('chosen')
        viewerNode.parentNode.appendChild(detailsNode)

        const _this = this
        const hideDetails = async function hideDetails({ target }) {
            if (!target.closest('.skills__details-close')
                && target.closest('.skills__details')) {
                document.addEventListener('mousedown', hideDetails, {
                    once: true })
                return
            }
            buttonNode.classList.remove('active')
            _this.activity.openedSection.classList.remove('chosen')
            delete _this.activity.shownTech
            await A.animate(detailsNode, ['opacity|1|0'], { duration: 300,
                dontFireOnChildren: true })
            if (detailsNode)
                detailsNode.remove()
        }
        setTimeout(() => document.addEventListener('mousedown', hideDetails, {
            once: true }))

        const detailsNodeLeft = parseInt(getComputedStyle(detailsNode).left)
        const contentNode = U(detailsNode).get('.skills__details-content')
        
        const fullWidth  = viewerNode.parentNode.offsetWidth
        const fullHeight = viewerNode.parentNode.offsetHeight

        const scrollTop = buttonNode.parentNode.parentNode.scrollTop

        const initialTop    = buttonNode.offsetTop - scrollTop
        const initialLeft   = buttonNode.offsetLeft
        const initialWidth  = buttonNode.offsetWidth
        const initialHeight = buttonNode.offsetHeight
        const initialBottom = fullHeight - initialTop - initialHeight
        const initialRight  = fullWidth - initialLeft - initialWidth

        const finalTop    = contentNode.offsetTop
        const finalLeft   = contentNode.offsetLeft + detailsNodeLeft
        const finalWidth  = contentNode.offsetWidth
        const finalHeight = contentNode.offsetHeight
        const finalBottom = fullHeight - finalTop - finalHeight
        const finalRight  = fullWidth - finalLeft - finalWidth

        const d = 12

        await A.animate(detailsNode, [
            `top    | ${initialTop}px    | ${finalTop > d ? finalTop : d}px`,
            `right  | ${initialRight}px  | ${finalRight}px`,
            `bottom | ${initialBottom}px | ${finalBottom > d ? finalBottom : d}px`,
            `left   | ${initialLeft}px   | ${finalLeft}px`
        ], { duration: 400, easing: 'ease-out' })

        if (detailsNode) {
            const scrollbarWidth = U.getScrollbarWidth()
            const wrapperNode = contentNode.querySelector('div')
            const styles = wrapperNode.style

            contentNode.classList.add('active')
            const wrapperHeight = Math.round(
                wrapperNode.getBoundingClientRect().height)
            const contentHeight = Math.round(
                contentNode.getBoundingClientRect().height)

            if (wrapperHeight > contentHeight) {
                if (scrollbarWidth) {
                    styles.paddingRight = `calc(2rem + ${50 - scrollbarWidth}px)`
                    styles.overflowY = 'scroll'
                }
                const offset = wrapperHeight - contentHeight
                if (offset) {
                    await A.animate(wrapperNode, `translateY|0|-${offset}px`,
                        { duration: 500, easing: 'ease-in-out' })
                    await A.animate(wrapperNode, `translateY|-${offset}px|0`,
                        { duration: 500, easing: 'ease-in-out' })
                }
            }
            wrapperNode.style.height = contentHeight + 'px'
            contentNode.classList.add('scrollable')
        }
    }

    getMarkup() {
        const next = T.get('NEXT')

        return `
            <section class="skills">
                <div class="skills__interface">
                    <div class="skills__header">
                        <div class="skills__header-shadow"></div>
                        <nav class="skills__categories"></nav>
                    </div>
                    <section class="skills__viewer-wrapper">
                        <section class="skills__viewer"></section>
                    </section>
                    <section class="skills__footer">
                        <div class="skills__footer-content">
                            <button class="skills__next">
                                <span>${next}</span>
                            </button>
                        </div>
                    </section>
                </div>
            </section>
        `
    }
}

export default Skills