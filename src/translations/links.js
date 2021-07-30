const user = '//github.com/rookhive'
const resumeRepository   = user + '/cv'
const examplesRepository = resumeRepository + '/blob/master/src/examples'

const webpackConfigClient  = examplesRepository + '/webpack-ssr-client.js'
const webpackConfigServer  = examplesRepository + '/webpack-ssr-server.js'
const graphQlAuthResolvers = examplesRepository + '/graphql-auth-resolvers.js'
const reactSSRServer       = examplesRepository + '/react-ssr-server.jsx'

export {
    resumeRepository,
    webpackConfigClient,
    webpackConfigServer,
    graphQlAuthResolvers,
    reactSSRServer
}