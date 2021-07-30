import Scene from '../Scene.js'

class Prologue extends Scene {
    static getKey() {
        return 'PROLOGUE'
    }

    constructor() {
        super(...arguments)
        const { $root } = this
        this.avatar      = $root.get('.prologue__avatar')
        this.description = $root.get('.prologue__description')
        this.gonext      = $root.get('.prologue__go-next-wrapper')
        this.duration    = 500
    }

    async start() {
        await this.runAsyncLoop(
            super.start,
            this.animateMainTitle,
            this.mountAvatarHexagon,
            this.showAvatar,
            this.showGreetMessage,
            this.showNextSceneButton
        )

        this.gonext.addEventListener('click', () => {
            this.app.openNextScene()
        })
    }

    showAvatar() {
        return A.animate(this.avatar, 'opacity|0|.99',
            { duration: this.duration * 2 })
    }

    showGreetMessage() {
        return A.animateTextByLine(
            this.description,
            ['opacity|0|1', 'translateY|15px|0'],
            { duration: this.duration, easing: 'ease-out'},
            { retrieveContent: true }
        )
    }

    showNextSceneButton() {
        return A.animate(this.gonext, ['opacity|0|1', 'scale|.5|1'], {
            duration: this.duration * 2, timing: 'ease-out' })
    }

    imageOnloadHandler() {
        if (this.classList.contains('loaded')) {
            return
        }
        this.classList.add('loaded')
        const useNode = this.parentNode.querySelector('svg > use')
        const duration = parseInt(getComputedStyle(useNode).animationDuration)
        const started = this.getAttribute('data-started')
        const iterationCount = Math.ceil(
            (Date.now() - started) / 1000 / duration
        )
        useNode.style.animationIterationCount = iterationCount % 2
            ? iterationCount
            : iterationCount + 1
        this.removeAttribute('data-started')
        this.removeAttribute('onload')
    }

    mountAvatarHexagon() {
        const { $root } = this

        // injsertAdjacentHTML doesn't work on SVG elements in iOS 9.3
        $root.get('.prologue__avatar').innerHTML = `
            <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                class="prologue__avatar-svg">
                <defs>
                    <clipPath id="avatar-mask"
                        clipPathUnits="objectBoundingBox">
                        <use xlink:href="assets/main.svg#avatar-hexagon"/>
                    </clipPath>
                    <linearGradient id="avatar-gradient"
                        x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#60a2ce"/>
                        <stop offset="100%" stop-color="#a6c5da"/>
                    </linearGradient>
                </defs>
            </svg>
        `

        const avatar = $root.get('.prologue__avatar-svg')
        const image = document.createElementNS('http://www.w3.org/2000/svg',
            'image')

        image.setAttribute('class', 'prologue__avatar-image')
        image.setAttribute('preserveAspectRatio', 'xMidYMid slice')
        image.setAttribute('x', '0')
        image.setAttribute('y', '0')
        image.setAttribute('width', '100%')
        image.setAttribute('height', '100%')
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'href',
            'assets/avatar.jpg')
        image.setAttribute('href', 'assets/avatar.jpg')
        image.setAttribute('clip-path', 'url(#avatar-mask)')
        image.setAttribute('data-started', Date.now())
        image.setAttribute('externalResourcesRequired', 'true')

        image.onload = this.imageOnloadHandler
        image.onSVGLoad = this.imageOnloadHandler

        U(image)
            .on('load', this.imageOnloadHandler)
            .on('SVGLoad', this.imageOnloadHandler)
            
        const placeholder = document.createElementNS(
            'http://www.w3.org/2000/svg', 'svg')
        placeholder.setAttribute('width', '100%')
        placeholder.setAttribute('height', '100%')
        placeholder.setAttribute('viewBox', '0 0 1 1')
        placeholder.innerHTML = 
            `<use
                class="prologue__avatar-placeholder"
                xlink:href="assets/main.svg#avatar-hexagon"
                href="assets/main.svg#avatar-hexagon"/>`
                
        avatar.appendChild(image)
        avatar.appendChild(placeholder)

        // Fallback for old mobiles or super-low internet connection
        setTimeout(this.imageOnloadHandler.bind(image), 1e4)
    }

    getMarkup() {
        const { description } = this.translations
        
        return `
            <div class="prologue">
                <section class="prologue__content">
                    <section class="prologue__avatar"></section>
                    <div class="prologue__description">${description}</div>
                    <div class="prologue__go-next-wrapper">
                        <button class="prologue__go-next-button">
                            <span></span>
                        </button>
                        <div class="prologue__go-next-blinking blinking
                            blinking_light"></div>
                        <div class="prologue__go-next-icon">
                            <svg class="icon">
                                <use xlink:href="assets/icons.svg#down"
                                    class="prologue__go-next-arrow"/>
                            </svg>
                        </div>
                    </div>
                </section>
            </div>
        `
    }
}

export default Prologue