import './styles'

import App from './App'
import Translator from './Translator'
import translations from './translations'
import Utils from './Utils'
import Animation from './Animation'
import sceneConfig from './sceneConfig'

Object.defineProperty(Array.prototype, 'last', {
    get: function () {
        return this[this.length - 1]
    }
})

if (!window.Element.prototype.hasOwnProperty('remove')) {
    Object.defineProperty(Element.prototype, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
            this.parentNode.removeChild(this)
        }
    })
}

Object.assign(window, {
    LAUNCH_TIMEOUT: 3500,
    U: Utils,
    A: new Animation(),
    T: new Translator({
        language: 'en',
        translations
    })
})

function run(set) {
    if (__DEV__ && typeof set === 'string') {
        console.warn(set)
    }
    !(new App({
        root: U('#app')[0],
        sceneConfig
    })).run()
}

let timeout = window.LAUNCH_TIMEOUT
if (document.fonts) {
    timeout *= 2
    Promise.race([
        document.fonts.ready,
        new Promise(ready => {
            setTimeout(
                ready,
                timeout,
                `Fonts.ready hasn't fired in ${timeout / 1000} seconds..`)
        })
    ]).then(() => setTimeout(run, timeout / 3))
} else {
    setTimeout(run, timeout)
}