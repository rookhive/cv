import Car from './Car'
import Superstory from './Superstory'

class StoryAnimator {
    constructor({ root, superstoryRoot, superstoryText, car, carRoot, detailRain,
        nextSceneHandler, reopenSceneHandler }) {
        this.root = root
        this.$root = U(root)
        this.nextSceneHandler = nextSceneHandler
        this.reopenSceneHandler = reopenSceneHandler
        this.storyChunks = U.splitText(superstoryText, ['|'])
        this.detailRain = detailRain

        this.superstory = new Superstory({
            lightMode: true, // without a navigation bar
            storiesNode: superstoryRoot,
            storyChunks: this.storyChunks
        })
        
        if (carRoot || car) {
            if (!carRoot) {
                carRoot = car.carNode
            }
            this.car = car || new Car({
                carNode: carRoot
            })

            if (detailRain) {
                this.detailNodes = Array.prototype.slice.call(
                    U(carRoot).getAll('.car__content > section'))
                this.detailIndexes = this.sortDetailIndexes(this.detailNodes,
                    this.storyChunks.map(chunk => +chunk.length))
            }
        }

        this.activity = {
            storyId: 0,
            actionId: 0
        }

        this.runtimeActions = [
            this.showStoryChunk,
            this.hideStoryChunk
        ]

        this.tapHandler = this.storyProcessSwitcher.bind(this)
    }

    runAsyncStory() {
        this.tellStory()

        return new Promise(resolve => {
            this.root.addEventListener('sceneCompleted', resolve)
        })
    }

    storyProcessSwitcher() {
        const { actionId } = this.activity

        if (actionId == 0) {
            this.activity.actionId = 1
            this.tellStory()
        }
    }

    showStoryChunk(storyIndex) {
        const storyDuration = this.superstory.getDurationByStory(storyIndex)

        if (this.detailRain) {
            const [startId, detailsAmount] = this.detailIndexes[storyIndex]
            this.car.animateDetails({
                startId,
                detailsAmount,
                duration: storyDuration
            })
        }

        return this.superstory.showStory(storyIndex)
    }

    hideStoryChunk(storyIndex) {
        return this.superstory.hideStory(storyIndex)
    }

    async tellStory(activity) {
        const { storyChunks } = this
        activity = activity || this.activity

        let { storyId, actionId } = activity

        if (storyId == 0 && actionId == 0) {
            this.setTapHandler('add')
        }

        const l = storyChunks.length
        for (; storyId < l; storyId++) {
            this.activity.storyId = storyId

            for (; actionId < this.runtimeActions.length; actionId++) {
                this.activity.actionId = actionId              
                await this.runtimeActions[actionId].bind(this)(storyId)

                if (this.activity.actionId != actionId
                    || this.activity.storyId != storyId) {
                    return
                }
            }
            
            this.activity.actionId = actionId = 0
        }

        this.root.dispatchEvent(new Event('sceneCompleted'))
    }

    imitateCarAppearance() {
        const delta = this.$root.get('.about__rest').offsetHeight
        const carNode = U(this.car.carNode).get('.car')

        carNode.style.opacity = 1

        return A.animate(carNode, [`translateY|${delta}px|0`], {
            duration: 3000,
            easing: 'ease-out'
        })
    }

    setTapHandler(action) {
        this.root[action + 'EventListener']('click', this.tapHandler)
    }

    sortDetailIndexes(details, storyLengths) {
        if (__DEV__ && details.length < storyLengths.length) {
            throw new Error('Number of details must be greater than number of'
                + ' story chunks.')
        }

        let detailsPerChunk = details.length / storyLengths.length
        const excessDetails = (detailsPerChunk ^ 0) != detailsPerChunk
        detailsPerChunk = Math.floor(detailsPerChunk)

        const largeStoryIndexes = excessDetails
            ? this.getLongestStoryIndexes(storyLengths,
                details.length - detailsPerChunk * storyLengths.length)
            : null

        return storyLengths
            .map((_, i) =>
                largeStoryIndexes && largeStoryIndexes.includes(i)
                    ? detailsPerChunk + 1
                    : detailsPerChunk)
            .reduce((result, detailsAmount, i) => {
                result.push([
                    i > 0
                        ? result[i - 1][0] + result[i - 1][1]
                        : 0,
                    detailsAmount
                ])
                return result
            }, [])
    }

    getLongestStoryIndexes(storyLengths, numberOfStories) {
        const saved = storyLengths.slice()
        return storyLengths.slice()
            .sort((a, b) => a - b)
            .slice(storyLengths.length - numberOfStories)
            .map(elem => {
                const index = saved.indexOf(elem)
                saved[index] = null
                return index
            })
    }

    launchCar() {
        return this.car.launch()
    }

    getCurrentStoryNode() {
        return this.superstory.storyNodes[this.activity.storyId]
    }

    async showControls() {
        const controls = this.$root.get('.about__controls')

        this.setTapHandler('remove')

        await A.animate(controls,
            ['translate|-50%,-50%|-50%,-50%', 'scale|.9|1', 'opacity|0|1'],
            { duration: 500 })

        const $controls = U(controls)
        if (!$controls.length) {
            return
        }

        $controls
            .findOne('.about__controls-next')
            .addClass('blinking')
            .on('click', this.nextSceneHandler)

        $controls
            .findOne('.about__controls-repeat')
            .on('click', this.reopenSceneHandler)
    }

    hideControls() {
        const controls = this.$root.get('.about__controls')
        return A.animate(controls, ['opacity|1|0'], { duration: 500 })
    }
}

export default StoryAnimator