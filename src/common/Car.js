export default class Car {
    constructor({ carNode, isRiding }) {
        this.carNode = carNode
        this.carNode.innerHTML = this.getMarkup(isRiding)
        this.detailNodes = Array.prototype.slice.call(
            U(this.carNode).getAll('.car__content > section'))
    }

    animateDetails({ startId, detailsAmount, duration }) {
        const details = this.detailNodes.slice(startId, startId + detailsAmount)
        const carRect = this.carNode.getBoundingClientRect()
        const radius = U.hypot(carRect.top + carRect.height, carRect.left +
            carRect.width)
        const cosine  = carRect.left / radius
        const radians = [Math.acos(-cosine), Math.acos(cosine)]

        details.forEach(async (detail, i, { length }) => {
            const radian    = -U.rand(radians, { float: true })
            const top       = Math.sin(radian) * radius
            const left      = Math.cos(radian) * radius
            const rotation  = U.rand(90, 360)
            const keyframes = ['opacity|0|1', 'scale|1.2|1.15']

            let finalLeft = 0

            switch (detail.className) {
                case 'car__front-left-wheel':
                case 'car__back-left-wheel':
                    finalLeft = -15
                    break

                case 'car__front-right-wheel':
                case 'car__back-right-wheel':
                    finalLeft = 15
                    break
            }

            await A.animate([
                { timing: {
                    duration: duration / length,
                    easing: 'ease-out' }
                },
                [
                    detail,
                    keyframes.concat([
                        `translate|${left}px,${top}px|${finalLeft}px,0`,
                        `rotate|${rotation}deg|0`
                    ]),
                    { delay: duration / details.length * i }
                ]
            ])

            if (detail) {
                await A.animate(detail, [
                    'scale|1.15|1',
                    `translate|${finalLeft}px,0|${finalLeft}px,0`,
                ], { duration: 500 })
            }

            if (detail) {
                A.animate(detail, `translateX|${finalLeft}px|0`,
                    { duration: 500 })
            }
        })
    }

    launch() {
        const carRect = this.carNode.getBoundingClientRect()
        const carOffset = carRect.top + carRect.height + carRect.height / 2
        U(this.carNode).findOne('.car__wave').addClass('active')

        return A.animate(this.carNode, [`translateY|0|-${carOffset}px`], {
            duration: 3000, easing: 'cubic-bezier(.76,.01,.79,.46)',
            dontFireOnChildren: true
        })
    }

    onClick(func) {
        U(this.carNode)
            .findOne('.car')
            .on('click', () => {
                func()
            }, { once: true })
    }

    getMarkup(isRiding) {
        const details = ['wheels-front', 'wheels-back', 'front-left-wheel', 
            'front-right-wheel', 'back-left-wheel', 'back-right-wheel', 'core',
            'hood', 'spoiler', 'spoiler-line', 'rudder-core', 'rudder-bagel',
            'chair', 'guy', 'helmet']

        const detailsMarkup = details
            .map(detailName => {
                let detailId

                switch (detailName) {
                    case 'wheels-front':
                    case 'wheels-back':
                        detailId = 'wheels'
                        break

                    case 'front-left-wheel':
                    case 'back-left-wheel':
                        detailId = 'left-wheel'
                        break

                    case 'front-right-wheel':
                    case 'back-right-wheel':
                        detailId = 'right-wheel'
                        break
                }

                return `
                    <section class="car__${detailName}">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <use xlink:href="assets/car.svg#${detailId ||
                                detailName}"/>
                        </svg>
                    </section>
                `
            })
            .join('')

        return `
            <div class="car ${isRiding ? 'active' : ''}">
                <div class="car__padding">
                    <div class="car__content">
                        ${detailsMarkup}
                        <div class="car__wave ${isRiding ? 'active' : ''}">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}