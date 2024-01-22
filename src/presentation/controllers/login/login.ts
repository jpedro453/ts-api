import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'
import { IEmailValidator } from '../../protocols/email-validator'

export class LoginController implements IController {
    private readonly emailValidator: IEmailValidator

    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.body.email) {
            return new Promise((resolve) => resolve(badRequest(new MissingParamError('email'))))
        }
        if (!httpRequest.body.password) {
            return new Promise((resolve) => resolve(badRequest(new MissingParamError('password'))))
        }

        const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
    }
}
