/**
 * Provides some methods for working with DOM.
 * Usage is similar to jQuery interface:
 * Utils(<selector>).<method>(), chaining is available.
 */
function Utils() {
    return new Query(...arguments)
}

/**
 * Methods for calling without initializing: U.<method>().
 */
Object.assign(Utils, {
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    breakStack(func, context, ...args) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(func.bind(context, ...args)())
            }, 1)
        })
    },

    /**
     * Returns the hypotenuse by cathetuses passed as arguments.
     */
    hypot(...cathetuses) {
        if (typeof Math.hypot == 'function') {
            return Math.hypot(...arguments)
        } else {
            return Math.sqrt(
                cathetuses.reduce((total, cathetus) => 
                    total + Math.pow(cathetus, 2), 0)
            )
        }
    },

    setActive(state, node, nodeProp) {
        if (state[nodeProp] !== undefined) {
            state[nodeProp].classList.remove('active')
        }
        node.classList.add('active')
        state[nodeProp] = node
    },

    getScrollbarWidth() {
        const body = document.body
        const div = document.createElement('div')
        div.style.cssText = `
            overflow-y: scroll;
            width: 50px;
            height: 50px;
            visibility: hidden;
        `
        body.appendChild(div)
        const scrollbarWidth = div.offsetWidth - div.clientWidth
        body.removeChild(div)
        return scrollbarWidth
    },

    /**
     * Returns the randow number in range of min and max.
     * If settings.float == true, returns float number. Otherwise, integer.
     */
    rand(min, max, settings) {
        if (Array.isArray(min)) {
            settings = max
            ;[ min, max ] = min
        }
        return (settings && settings.float)
            ? Math.random() * (max - min) + min
            : Math.floor(Math.random() * (max - min + 1) + min)
    },

    /**
     * @param {iterable} one
     * @param {iterable} two
     * @return {number} Index of the first different element of two arrays
     *                  (strings), or -1, if there are no equal elements
     *                  starting with the 0 index.
     */
    getFirstDifferentIndex(one, two) {
        const sequence = [one, two]
        if (one.length > two.length)
            sequence.reverse()
        for (let i = 0; i < sequence[1].length; i++) {
            if (sequence[0][i] !== sequence[1][i])
                return i
        }
        return -1
    },

    /**
     * Returns common elements of one and two, starting with the 0 index.
     *     getCommonPart('stay', 'stand')  <- 'sta'
     *     getCommonPart([3,2,1], [3,2,5]) <- [3,2]
     * @param {iterable} one
     * @param {iterable} two
     * @return {array} Common elements of one and two.
     */
    getCommonPart(one, two) {
        const biggest = one.length > two.length ? one : two
        const i = this.getFirstDifferentIndex(...arguments)
        return biggest.slice(0, i < 0 ? null : i)
    },

    /**
     * splitText('one two|three four||five six|seven eight', ['||', '|', ' '])
     * <-- [
     *     [ ['one',  'two'], ['three', 'four' ] ],
     *     [ ['five', 'six'], ['seven', 'eight'] ]
     * ]
     */
    splitText(textParts, separators) {
        let firstIteration
        if (typeof textParts == 'string') {
            if (separators.length == 1) {
                return textParts.split(separators[0])
            } else {
                firstIteration = true
                textParts = textParts.split()
            }
        }
        const result = textParts.map(part => {
            const splitPart = part.split(separators[0])
            return separators.length > 1
                ? this.splitText(splitPart, separators.slice(1))
                : splitPart
        })
        return firstIteration ? result.flat() : result
    },

    /**
     * Split text by letters, wrapping each letter with span:
     * splitByLetter('A b')
     * <-- '<span class="word"><span>A</span></span> <span class="word">
     *      <span>b</span></span>'
     */
    splitByLetter(text) {
        return text
            .split(' ')
            .map(word => {
                word = word
                    .split('')
                    .map(letter => `<span class="letter">${letter}</span>`)
                    .join('')
                return `<span class="word break">${word}</span>`
            })
            .join('<span class="break"> </span>')
    },

    /**
     * getGridMarkup(['one', 'two', 'three', 'four'], 2)
     * <- '<ul><li>one</li><li>two</li></ul>
     *     <ul><li>three</li><li>four</li></ul>'
     * 
     * @param {array}  items     Array with data for colElem fields 
     * @param {string} rowTag    Row element's tag
     * @param {string} colTag    Column element's tag
     * @param {number} colNumber Number of columns in a row
     * @return {DOMString}       Markup 
     */
    getGridMarkup(items, colNumber, rowTag = 'ul', colTag = 'li') {
        let markup = ''
        
        items.forEach((item, i) =>{
            if (i % colNumber == 0) {
                markup += `<${rowTag}>`
            }
            markup += `<${colTag}>${item}</${colTag}>`
            if (i % colNumber == colNumber - 1 || i == items.length - 1) {
                markup += `</${rowTag}>`
            }
        })

        return markup
    },

    /**
     * Split text by words, wrapping each word (and spaces) with span that has
     * '.word.break' (and just .break for spaces) class attribute.
     */
    splitByWord(text) {
        return text.split(' ').map(word => {
            return `<span class="word break">${word}</span>`
        }).join('<span class="break"> </span>')
    },

    parseNodeByLetter(node) {
        node.innerHTML = this.splitByLetter(node.textContent)
        node.innerHTML = this.splitByLine(node)
    },

    /**
     * Split node's by lines. Node content must be separated by elements with
     * '.break' class attribute.
     * @param {HTMLElement} node 
     */
    splitByLine(node) {
        const start = '<div class="line">'
        const end   = '</div>'
        const words = node.querySelectorAll('.break')
        let lastOffset = words[0].offsetTop
        let result = start

        Array.prototype.forEach.call(words, word => {
            if (word.offsetTop !== lastOffset && word.classList.contains('word')) {
                result += end + start
                lastOffset = word.offsetTop
            }
            result += word.outerHTML
        })
        
        result += end
        return result
    },

    /**
     * Super-simple and not comprehensive comparison of two values.
     * @param {any} one
     * @param {any} two
     * @return {boolean} True if one equals to two, false otherwise.
     */
    isEqual(one, two) {
        if (typeof one !== typeof two)
            return false
        if (typeof one === 'object') {
            if (Object.keys(one).length !== Object.keys(two).length)
                return false
            for (let key in one) {
                if (!one.hasOwnProperty(key) || !two.hasOwnProperty(key))
                    continue
                if (one[key] !== two[key])
                    return false
            }
        } else if (Array.isArray(one)) {
            throw new Error('Array comparasion is not available yet.')
        } else {
            return one == two
        }
        return true
    }
})

class Query {
    constructor(selector) {
        let nodesList
        if (selector instanceof Element || selector instanceof HTMLElement
            || selector instanceof Document) {
            nodesList = [selector]
        } else {
            nodesList = typeof selector === 'string'
                ? document.querySelectorAll(selector)
                : selector instanceof NodeList
                    ? selector
                    : []
        }
        this.nodes = Array.prototype.slice.call(nodesList)
        this.nodes.forEach((node, i) => this[i] = node)
        this.length = this.nodes.length
        return this
    }

    /**
     * Convinient event listeners binding for delegation.
     * U('#app').on([
     *     ['click', '[data-app-role="main"]', () => console.log('Clicked!')]
     * ])
     * @param {array} instructions An array of instructions:
     * [[<{string} event>, <{string} selector>, <{function}> event handler], ..]
     */
    on(event, handler, settings) {
        if (typeof event == 'string'
            && typeof handler == 'function') {
            this.nodes.forEach(node => {
                node.addEventListener(event, event => {
                    handler.call(node, event, node)
                }, settings)
            })
        } else if (Array.isArray(event)) {
            this.nodes.forEach(node => {
                event.forEach(([action, selector, handler, settings = {}]) => {
                    if (typeof selector == 'function') {
                        return this.on(action, selector, handler)
                    }
                    node.addEventListener(action, event => {
                        const target = selector
                            ? event.target.closest(selector)
                            : null
                        if (target || !selector && event.target === node) {
                            handler.call(target, event, target)
                        }
                    }, settings)
                })
            })
        }
        return this
    }

    get(selector) {
        return this[0].querySelector(selector)
    }

    getAll(selector) {
        return this[0].querySelectorAll(selector)
    }

    findOne(selector) {
        return new Query(this.get(selector))
    }

    addClass(className) {
        this._handleClass('add', className)
        return this
    }

    removeClass(className) {
        this._handleClass('remove', className)
        return this
    }

    _handleClass(action, className) {
        this.nodes.forEach(node => {
            node.classList[action](className)
        })
    }
}

export default Utils