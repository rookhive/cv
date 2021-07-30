import React from 'react'
import path from 'path'
import { renderToString } from 'react-dom/server'
import { StaticRouter as Router, matchPath } from 'react-router-dom'
import Helmet from 'react-helmet'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import { createStore, applyMiddleware } from 'redux'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import routes from './routes.js'
import favicon from './assets/favicon.ico'
import combinedReducer from './reducers'
import App from './components/App'
import MobileDetect from 'mobile-detect'
const statsFile = path.resolve('./dist/assets/loadable-stats.json')

const preloadSagas = sagas => function* () {
    const tasks = sagas.map(
        ({ saga, params }) => call(saga, params)
    )
    yield all([...tasks])
}

export const ssr = {
    build: ({ url, headers }) => {
        const context = {}
        const sagaMiddleware = createSagaMiddleware()
        const store = createStore(
            combinedReducer,
            applyMiddleware(sagaMiddleware)
        )
        store.dispatch({
            type: 'SET_MOBILE_DETECT',
            md: new MobileDetect(headers['user-agent'])
        })
        let sagas = []
        try {
            routes.forEach(route => {
                const match = matchPath(url, route)
                if (
                    match instanceof Object
                    && match.isExact
                    && route.components
                ) {
                    route.components.forEach(component => {
                        if (typeof component.preload !== 'function') return
                        const preloadSagas = component.preload()
                        preloadSagas.forEach(preloadSaga => {
                            sagas.push({
                                saga: preloadSaga,
                                params: match.params
                            })
                        })
                    })
                }
            })
        } catch (error) {
            // TODO: Log error
            console.warn(error)
        }
        return sagaMiddleware
            .run(preloadSagas(sagas))
            .toPromise()
            .then(() => {
                const extractor = new ChunkExtractor({ statsFile })
                const markup = renderToString(
                    <Provider store={store}>
                        <Router location={url} context={context}>
                            <ChunkExtractorManager extractor={extractor}>
                                <App />
                            </ChunkExtractorManager>
                        </Router>
                    </Provider>
                )
                const helmet = Helmet.renderStatic()
                return {
                    favicon,
                    markup,
                    scripts: extractor.getScriptTags(),
                    styles: extractor.getStyleTags(),
                    helmet: helmet,
                    preloadedState: store.getState()
                }
            })
    }
}