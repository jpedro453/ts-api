import { adaptMiddleware } from '@/main/adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '@/main/factories/controllers/middlewares/auth-middleware-factory'

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
