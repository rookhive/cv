import Scene from  '../Scene'

class About extends Scene {
    static getKey() {
        return 'ABOUT'
    }

    constructor() {
        super(...arguments)
        this.theme = {
            color: '#dfdfdf'
        }
    }

    startAlreadyMounted() {
        return this.startChapter()
    }

    async start() {
        await super.start()
        if (this.isDead()) return
        return this.startAlreadyMounted()
    }

    getMarkup() {
        return '<section class="about"></section>'
    }
}

export default About