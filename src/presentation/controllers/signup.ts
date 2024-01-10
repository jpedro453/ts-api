import { MissingParamError } from '../errors/missing-param-error'
import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { IController } from '../protocols/controller'
import { IEmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator

    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: IHttpRequest): IHttpResponse {
        const requiredFields = [
            'name',
            'email',
            'password',
            'password_confirmation',
        ]

        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }

        if (!this.emailValidator.isValid(httpRequest.body.email)) {
            return badRequest(new InvalidParamError('email'))
        }
    }
}
