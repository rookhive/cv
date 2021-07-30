class Listener {
    constructor(config) {
        this.root = config.root
        this.lastData = {}
    }

    notify(data) {
        if (U.isEqual(data, this.lastData)) {
            return
        }
        Object.assign(this.lastData, data)
        return this.onMessage(this.lastData)
    }
}

export default Listener