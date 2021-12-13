import express from 'express'

import setupApolloServer from './apollo-server'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './swagger'

const app = express()
setupApolloServer(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
