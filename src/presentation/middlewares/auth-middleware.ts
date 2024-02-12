import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { IHttpRequest, IHttpResponse } from '../protocols'
import { IMiddleware } from '../protocols/middleware'

export class AuthMiddleware implements IMiddleware {
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const error = forbidden(new AccessDeniedError())
        return new Promise((resolve) => resolve(error))
    }
}
