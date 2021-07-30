import Scene from  '../Scene'
import StoryAnimator from '../common/StoryAnimator'

class Prehistory extends Scene {
    static getKey() {
        return 'PREHISTORY'
    }

    constructor() {
        super(...arguments)
        this.theme = {
            color: '#ddd'
        }
    }

    rebuild() {
        return () => {
            this.app.open(this.app.runtime.targetId, true)
        }
    }

    start() {
        return this.runAsyncLoop(
            this.fadeScene.bind(this, 'in'),
            this.animateTitle,
            this.startTheShow,
            () => this.animator.showControls()
        )
    }

    startTheShow() {
        const { $root } = this
        this.animator = new StoryAnimator({
            root:             this.root,
            carRoot:          $root.get('.about__car'),
            superstoryRoot:   $root.get('.about__content'),
            superstoryText:   this.translations.story,
            nextSceneHandler: this.app.openNextScene,
            reopenSceneHandler: () => {
                this.app.open(this.app.runtime.targetId, true)
            },
            detailRain: true
        })
        return this.animator.runAsyncStory()
    }

    async finish() {
        await this.finalAnimation()
        await this.fadeScene('out')
    }

    finalAnimation() {
        return Promise.all([
            this.animator.launchCar(),
            this.animator.hideControls()
        ])
    }

    getMarkup() {
        return `
            <div class="prehistory about__subscene">
                <section class="about__content"></section>
                <section class="about__rest">
                    <div class="about__car"></div>
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

export default Prehistory