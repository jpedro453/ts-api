import express from 'express'
import setupMiddleWares from './middlewares'

const app = express()
setupMiddleWares(app)

export default app
