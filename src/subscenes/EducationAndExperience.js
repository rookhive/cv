import Scene from  '../Scene'
import Car from '../common/Car'
import StoryAnimator from '../common/StoryAnimator'

class EducationAndExperience extends Scene {
    static getKey() {
        return 'EDUCATION_AND_EXPERIENCE'
    }

    constructor() {
        super(...arguments)
        this.theme = {
            color: '#ddd'
        }

        const { $root }    = this
        this.storiesNode   = $root.get('.about__content')
        this.carNode       = $root.get('.about__car')
        this.linesNode     = $root.get('.education-and-experience__road-lines')
        this.linesDuration = 1000

        this.car = new Car({
            carNode: this.carNode,
            isRiding: true
        })
    }

    rebuild() {
        return () => {
            this.app.open(this.app.runtime.targetId, true)
        }
    }

    async start() {
        this.savedSceneId = this.app.runtime.currentId
        this.animator = new StoryAnimator({
            root:             this.root,
            car:              this.car,
            superstoryRoot:   this.storiesNode,
            superstoryText:   this.translations.story,
            nextSceneHandler: this.app.openNextScene,
            reopenSceneHandler: () => {
                this.app.open(this.app.runtime.targetId, true)
            }
        })

        await this.runAsyncLoop(
            this.fadeScene.bind(this, 'in'),
            this.animateTitle,
            this.animateRoadLines,
            this.fadeInRoadLines,
            this.ctx('imitateCarAppearance', this.animator),
            this.addSomeBlackThoughts,
            this.ctx('runAsyncStory', this.animator),
            () => this.animator.showControls()
        )
    }

    async finish() {
        await super.finish()

        const styles = document.documentElement.style
        styles.removeProperty('--road-line-start')
        styles.removeProperty('--road-line-end')
    }

    crash() {
        return this.finish()
    }

    fadeInRoadLines() {
        return A.animate(this.linesNode, ['opacity|0|1'], { duration: 1000 })
    }

    animateRoadLines() {
        const variablesRoot = document.documentElement
        const carHeight = this.$root.get('.car').offsetHeight * .75
        const lineEnd = carHeight * 2 + 'px'

        variablesRoot.style.setProperty('--road-line-start', carHeight + 'px')
        variablesRoot.style.setProperty('--road-line-end', lineEnd)

        this.$root.get('.education-and-experience__road').style.top
            = `-${lineEnd}`
        
        U(this.linesNode).addClass('ready')
    }

    addSomeBlackThoughts() {
        this.blackThoughts = T.get('BLACK_THOUGHTS')
        this.runBlackThought(0, true)
    }

    async runBlackThought(id, even) {
        const reversed = even ? '' : 'black-thought__arrow_reversed'
        const blackThought = document.createElement('div')
        blackThought.className = 'black-thought'
        blackThought.innerHTML = `
            <div class="black-thought__arrow ${reversed}">
                <svg viewBox="0 0 40 60">
                    <path fill="rgba(255, 255, 255, .075)"
                        d="M 12.5 60
                            L 12.5 40
                            L 20 25
                            L 15 22.5
                            L 35 10
                            L 35 32.5
                            L 30 30
                            L 23.5 43
                            L 23.5 60
                            Z"/>
                </svg>
            </div>
            <div class="black-thought__slogan">${this.blackThoughts[id]}</div>
        `
        this.$root.get('.education-and-experience')
            .appendChild(blackThought)

        const car = this.$root.get('.car')
        const carWidth = car.offsetWidth
        const carHeight = car.offsetHeight
        const sceneHeight = this.root.offsetHeight

        blackThought.style.top = '-300px'
        blackThought.style[even ? 'left' : 'right']
            = `calc(50% + ${carWidth}px / 2)`
        blackThought.style.width = carWidth + 'px'

        const path = sceneHeight + carHeight * 2 + 300
        const thoughtSpeed = car.offsetHeight * 1.5 / 1000
        const duration = path / thoughtSpeed

        const leftSign = ['-', '+']
        even && leftSign.reverse()

        await A.animate([
            [blackThought, [`translateY|0|${path}px`], {
                duration, delay: 1000 }],
            [car, [`left|${leftSign[0]}100%|${leftSign[1]}100%`], {
                duration: duration / 2,
                delay: duration / 3,
                easing: 'ease-in-out'
            }]
        ])

        blackThought.remove()

        if (!this.isDead()) {
            this.runBlackThought(
                id == this.blackThoughts.length - 1 ? 0 : ++id,
                !even
            )
        }
    }

    getMarkup() {
        return `
            <div class="education-and-experience about__subscene">
                <section class="about__content"></section>
                <section class="about__rest">
                    <div class="about__car"></div>
                </section>
                <section class="education-and-experience__road">
                    <div class="education-and-experience__road-lines"></div>
                </section>
                <section class="about__controls">
                    <button class="about__controls-repeat">
                        <svg class="icon">
                            <use xlink:href="assets/icons.svg#repeat"/>
                        </svg>
                    </button>
                    <button class="about__controls-next">
                        <svg class="icon">
                            <use xlink:href="assets/icons.svg#next"/>
                        </svg>
                    </button>
                </section>
            </div>
        `
    }
}

export default EducationAndExperience