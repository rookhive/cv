import Locator from './listeners/Locator'
import Menu from './listeners/Menu'

class App {
    constructor(config) {
        if (__DEV__) {
            if (!config) {
                throw new Error('App config is required.')
            }
            if (!config.root || !document.body.contains(config.root)) {
                throw new Error('The root node is incorrect or doesn\'t exist.')
            }
        }
        this.root = config.root
        this.runtime = { mountedScenes: {} }
        this.sceneConfig = config.sceneConfig
        this.sceneConfigStructured =
            this.getStructuredsceneConfig(this.sceneConfig)

        this.listeners = this.initListeners([
            [Locator, U('#locator')[0]], [Menu, U('#menu')[0]] ])
    }

    run() {
        window.addEventListener('resize', this.rebuildScene.bind(this))
        U(document.body).addClass('ready')
        this.open('0')
    }

    getStructuredsceneConfig(sceneConfig) {
        const structuredsceneConfig = {}

        !(function parseConfig(config, path = '') {
            config.forEach((sceneObject, i) => {
                const currentPath = path + (path ? '-' : '') + i
                structuredsceneConfig[currentPath]
                    = typeof sceneObject === 'function'
                        ? sceneObject
                        : sceneObject.scene
                if (typeof sceneObject === 'object'
                    && sceneObject.subscenes) {
                    parseConfig(sceneObject.subscenes, currentPath)
                }
            })
        })(sceneConfig)

        return structuredsceneConfig
    }

    initListeners(listeners) {
        const app = {
            runtime: this.runtime,
            open: this.open.bind(this),
            getKeyById: this.getKeyById.bind(this),
            rebuildScene: this.rebuildScene.bind(this)
        }

        return listeners.map(data => {
            const [constructor, root] = data
            return new constructor({ root, app })
        })
    }

    async render(forcedFlag) {
        const instructions = {}
        const { runtime } = this
        const { targetId, renderingId } = runtime

        let { currentId } = runtime
        let needReRender

        if (currentId === targetId && !forcedFlag) {
            let scene = this.getMountedSceneById(currentId)
            if (!scene) {
                scene = this.mountScene(currentId)
            }

            await this.notifyListeners({
                currentId,
                targetId,
                sceneName: scene.getName(),
                theme: scene.theme
            })
            if (scene) {
                scene.startAlreadyMounted()
            }
            return
        }

        const currentIdParsed = this.parseId(currentId)
        const targetIdParsed = this.parseId(targetId)
        const firstDifferentSceneIndex = U.getFirstDifferentIndex(
            currentIdParsed, targetIdParsed)
        const firstDifferentSceneIdParsed =
            targetIdParsed.slice(0, firstDifferentSceneIndex + 1)

        if (renderingId) {
            const renderingScene = this.getMountedSceneById(renderingId)

            if (!renderingScene) {
                console.error('Rendering scene doesn\'t exist:', renderingId)
                return
            }

            const renderingIdParsed = this.parseId(renderingId)
            const firstDifferentSceneIndex = U.getFirstDifferentIndex(
                renderingIdParsed, targetIdParsed)
            const noNeedToAbortRenderingScene = 
                firstDifferentSceneIndex
                && targetIdParsed.length > renderingIdParsed.length

            if (!noNeedToAbortRenderingScene
                && renderingScene.state == 'opening') {
                instructions.scene = renderingScene
                instructions.action = 'abort'
                renderingScene.isAborted = true
                runtime.currentId = this.getParentId(renderingId)
                needReRender = true
            } else {
                return
            }
        }

        else if (firstDifferentSceneIdParsed.length <= currentIdParsed.length) {
            currentIdParsed.pop()
            this.runtime.currentId = this.stringifyId(currentIdParsed)
            instructions.scene = this.getMountedSceneById(currentId)
            instructions.action = 'close'
        }

        else {
            this.runtime.currentId
                = currentId
                = this.stringifyId(firstDifferentSceneIdParsed)
            instructions.scene = this.mountScene(currentId)
            instructions.action = 'open'
        }

        const { scene, action } = instructions
        runtime.renderingId = currentId
        runtime.renderingAction = action

        await this.notifyListeners({
            currentId,
            targetId,
            sceneName: scene.getName(),
            theme: scene.theme
        })

        if (runtime.renderingId !== currentId
            || runtime.targetId !== targetId) {
            delete runtime.renderingId
            delete runtime.renderingAction
            this.render()
            return
        }

        await scene[action]()

        // If another animation is going, e.g. aborting, will be deleted only
        // the last renderingId marker.
        if (runtime.renderingId === currentId
            && runtime.renderingAction === action) {
            delete runtime.renderingId
            delete runtime.renderingAction
        }

        if (!scene.isAborted || needReRender) {
            if (action !== 'open') {
                this.deleteSceneData(currentId)
            }
            if (currentId !== runtime.targetId) {
                this.render()
            } else {
                setTimeout(this.notifyListeners.bind(this), 1, {
                    currentId,
                    targetId: currentId,
                    sceneName: scene.getName(),
                    theme: scene.theme
                })
                if (action == 'close' || action == 'abort') {
                    this.render()
                }
            }
        }
    }

    mountScene(sceneId) {
        const Scene = this.getSceneById(sceneId)
        if (!Scene) {
            __DEV__ && console.warn(`Couldn't mount scene ${sceneId}.`)
            return false
        }
        const scene = new Scene({
            runtime: this.runtime,
            open: this.open.bind(this),
            openNextScene: this.openNextScene.bind(this)
        })
        const parentObject =
            this.runtime.mountedScenes[this.getParentId(sceneId)] || this
        parentObject.root.appendChild(scene.root)
        return this.runtime.mountedScenes[sceneId] = scene
    }

    deleteSceneData(sceneId) {
        delete this.runtime.mountedScenes[sceneId]
    }

    notifyListeners(newData) {
        return Promise.all(
            this.listeners.map(listener => listener.notify(newData))
        )
    }

    rebuildScene(dontRebuild) {
        clearTimeout(this.runtime.resizeTimer)
        let rebuild

        if (typeof dontRebuild == 'object') {
            const { mountedScenes, targetId } = this.runtime
            const scene = mountedScenes[targetId]

            if (scene) {
                rebuild = scene.rebuild()
            }
        }

        const rebuildingText = T.get('REBUILDING')

        if (!this.runtime.resizeLoaderNode && (dontRebuild === true
            || typeof rebuild == 'function')) {
            const resizeLoaderNode = this.runtime.resizeLoaderNode
                = document.createElement('div')
            resizeLoaderNode.className = 'resize-loader-wrapper'
            resizeLoaderNode.innerHTML = `
                <div class="resize-loader">
                    <div class="resize-loader__hexagon">
                        <span></span>
                    </div>
                    <div class="resize-loader__hex resize-loader__hex-blue">
                        <span></span>
                    </div>
                    <div class="resize-loader__hex resize-loader__hex-red">
                        <span></span>
                    </div>
                    <div class="resize-loader__title">${rebuildingText}..</div>
                </div>
            `
            document.body.appendChild(resizeLoaderNode)
        }

        rebuild && rebuild()

        this.runtime.resizeTimer = setTimeout(async () => {
            const { resizeLoaderNode } = this.runtime
            if (!resizeLoaderNode) {
                return
            }
            await A.animate(resizeLoaderNode, 'opacity|1|0', { duration: 500 })
            if (this.runtime.resizeLoaderNode) {
                this.runtime.resizeLoaderNode.remove()
                delete this.runtime.resizeLoaderNode
            }
        }, dontRebuild === true ? 3000 : 1500)
    }

    open(sceneId, forcedFlag) {
        const { runtime } = this
        if (runtime.targetId === sceneId && !forcedFlag) {
            __DEV__ && console.warn('Attempted to open the same scene.')
            return
        }
        runtime.targetId = sceneId
        this.render(forcedFlag)
    }
    
    openNextScene() {
        const { targetId } = this.runtime
        const nextSceneId = this.getNextSceneId(targetId)
        if (nextSceneId) {
            this.open(nextSceneId)
        } else if (__DEV__) {
            console.log('This is the last scene, nothing to open next.')
        }
    }

    getNextSceneId(sceneId) {
        const sceneIds = Object.keys(this.sceneConfigStructured).sort()
        let currentSceneIndex = sceneIds.indexOf(sceneId)
        return currentSceneIndex > -1 && ++currentSceneIndex !== sceneIds.length
            ? sceneIds[currentSceneIndex]
            : ''
    }

    getKeyById(sceneId) {
        return this.sceneConfigStructured[sceneId].getKey()
    }

    getSceneById(sceneId) {
        return this.sceneConfigStructured[sceneId] || false
    }

    getMountedSceneById(sceneId) {
        return this.runtime.mountedScenes[sceneId]
    }

    getParentId(sceneId) {
        const parsedId = this.parseId(sceneId)
        parsedId.pop()
        return this.stringifyId(parsedId)
    }

    parseId(id) {
        return id ? id.split('-') : []
    }

    stringifyId(array) {
        return array ? array.join('-') : ''
    }
}

export default App