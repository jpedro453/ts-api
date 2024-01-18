import express from 'express'
import setupMiddleWares from './middlewares'
import setupRoutes from './routes'

const app = express()
setupMiddleWares(app)
setupRoutes(app)

export default app
