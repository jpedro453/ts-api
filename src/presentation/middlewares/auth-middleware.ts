import { ILoadAccountByToken } from '../../domain/useCases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http/http-helper'
import { IHttpRequest, IHttpResponse } from '../protocols'
import { IMiddleware } from '../protocols/middleware'

export class AuthMiddleware implements IMiddleware {
    constructor(private readonly loadAccountByToken: ILoadAccountByToken) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const accessToken = httpRequest.headers?.['x-access-token']
        if (accessToken) {
            const account = await this.loadAccountByToken.load(accessToken)
            if (account) {
                return ok({ accountID: account.id })
            }
        }
        return forbidden(new AccessDeniedError())
    }
}
