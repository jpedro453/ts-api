import { IHttpRequest, IMiddleware } from '@/presentation/protocols'
import { Request, Response, NextFunction } from 'express'

export const adaptMiddleware = (middleware: IMiddleware) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const httpRequest: IHttpRequest = {
            headers: req.headers
        }
        const httpResponse = await middleware.handle(httpRequest)
        if (httpResponse.statusCode === 200) {
            Object.assign(req, httpResponse.body)
            next()
        } else {
            res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
        }
    }
}
