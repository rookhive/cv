export default class Superstory {
    constructor({ storyChunks, ...config }) {
        Object.assign(this, config, {
            speed: 25
        })

        this.storyNodes   = []
        this.storyOrigins = []
        this.parsedStory  = storyChunks
        
        this.lineDuration      = 500
        this.lineDissDuration  = 500
        this.letterDuration    = 500

        if (!this.lightMode) {
            this.navNode = document.createElement('nav')
            this.navNode.className = 'superstory__nav'
            this.storiesNode.appendChild(this.navNode)
            this.createNavButtons()
        }

        this.mountStories()
    }

    async animateStories() {
        for (let i = 0, length = this.storyNodes.length; i < length; i++) {
            const isTheLastScene = !this.lightMode && length == i + 1

            await this.animateStory(
                this.storyNodes[i], 
                this.storyOrigins[i],
                isTheLastScene
            )
        }
        if (this.lightMode) {
            this.removeStoryNodes()
        }
    }

    getTotalDuration() {
        const duration = this.storyNodes
            .reduce((totalDuration, storyNode) => {
                const storyDuration = this.getDurationByStory(storyNode)
                return totalDuration + storyDuration
            }, 0)

        return duration
    }

    getDurationByStory(storyNode) {
        if (typeof storyNode == 'number') {
            storyNode = this.storyNodes[storyNode]
        }

        const lines = Array.prototype.slice.call(
            U(storyNode).getAll('.line'))
        const linesNumber = lines.length
        let lettersAppearDuration = 0

        lines.forEach(line => {
            const lettersNumber = U(line).getAll('.letter').length
            lettersAppearDuration += (1000 / this.speed) *
                (lettersNumber - 1) + this.letterDuration
        })

        const lineDissDuration = this.lineDissDuration /
            linesNumber * (linesNumber - 1) + this.lineDuration

        const pendingDuration = 1000

        return lettersAppearDuration + lineDissDuration + pendingDuration
    }

    createNavButtons() {
        for (let i = 0; i < this.parsedStory.length; i++) {
            const navButton = document.createElement('button')
            navButton.setAttribute('data-id', i + 1)
            this.navNode.appendChild(navButton)
            U(navButton).on('click', this.openStory.bind(this))
        }
    }

    mountStories() {
        for (let i = 0, length = this.parsedStory.length; i < length; i++) {
            const storyNode = this.mountStory(i)
            this.storyOrigins.push(storyNode.innerHTML)
            // storyNode.innerHTML = U.splitByLetter(storyNode.innerText)
            // storyNode.innerHTML = U.splitByLine(storyNode)
            U.parseNodeByLetter(storyNode)
            this.storyNodes.push(storyNode)
        }
    }

    mountStory(id) {
        const wrapper = document.createElement('div')
        wrapper.className = 'superstory__wrapper'
        const storyNode = document.createElement('div')
        storyNode.className = 'superstory__story'
        storyNode.setAttribute('data-id', id + 1)
        storyNode.innerHTML = this.parsedStory[id]
        wrapper.appendChild(storyNode)
        this.storiesNode.appendChild(wrapper)

        if (!this.lightMode) {
            const { highestStory } = this
            const storyHeight = storyNode.offsetHeight
            if (!highestStory || highestStory < storyHeight) {
                this.highestStory = storyHeight
                this.navNode.style.transform = `translateY(${storyHeight}px)`
            }
        }

        return storyNode
    }

    removeStoryNodes() {
        const wrappers = Array.prototype.slice.call(
            U(this.storiesNode).getAll('.superstory__wrapper'))
        
        while (wrappers.length) {
            const wrapper = wrappers.pop()
            wrapper.remove()
        }
    }

    async animateStory(storyNode, storyOrigin, last) {
        await this.showStory(storyNode)

        if (last) {
            storyNode.innerHTML = storyOrigin
            storyNode.style.opacity = ''
            U(this.navNode).addClass('ready')
            this.openStory(null, this.navNode.querySelector('button:last-child'))
            return
        }
        
        await this.hideStory(storyNode, storyOrigin)
    }

    async showStory(storyNode) {
        if (typeof storyNode == 'number') {
            storyNode = this.storyNodes[storyNode]
        }
        storyNode.style.opacity = 1
        await A.showStoryByLetter(storyNode, { speed: this.speed })
        return U.wait(1000) // one additional second for reading the text
    }

    async hideStory(storyNode, storyOrigin) {
        if (typeof storyNode == 'number') {
            if (!storyOrigin) {
                storyOrigin = this.storyOrigins[storyNode]
            }
            storyNode = this.storyNodes[storyNode]
        }
        await this.fadeStoryByLine(storyNode, storyOrigin)
        storyNode.remove()
    }

    openStory(_, button) {
        const { id } = button.dataset
        if (this.openedStory && this.openedStory !== id) {
            this.navNode
                .querySelector(`[data-id="${this.openedStory}"]`)
                .classList.remove('active')
            this.toggleStory('hide', this.openedStory)
        }
        button.classList.add('active')
        this.toggleStory('show', id)
        this.openedStory = id
    }

    async fadeStoryByLine(storyNode, storyOrigin) {
        await A.animateTextByLine(
            storyNode, ['opacity|1|0'], { duration: this.lineDuration },
            {
                totalDuration: this.lineDissDuration,
                retrieveContent: storyOrigin,
                cssBeforeRetrieving: { opacity: '' },
                alreadyParsed: true
            }
        )
        this.lightMode && storyNode.remove()
    }

    toggleStory(action, id) {
        U(this.storiesNode).get(`.superstory__story[data-id="${id}"]`)
            .classList[action == 'show' ? 'add' : 'remove']('active')
    }

    finish() {
        return Promise.all([
            this.hideNavigation(),
            this.hideNavigatedStory()
        ])
    }

    hideNavigation() {
        return A.animate(this.navNode, ['opacity|1|0'], { duration: 300 })
    }

    hideNavigatedStory() {
        return A.animateTextByLine(
            this.storyNodes[this.openedStory - 1],
            ['opacity|1|0'],
            { duration: 300 },
            {
                totalDuration: 500,
                reverseOrder: true
            }
        )
    }
}