import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'

export class LoginController implements IController {
    handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.body.email) {
            return new Promise((resolve) => resolve(badRequest(new MissingParamError('email'))))
        }
        if (!httpRequest.body.password) {
            return new Promise((resolve) => resolve(badRequest(new MissingParamError('password'))))
        }
    }
}
