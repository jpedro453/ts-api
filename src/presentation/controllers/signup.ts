import { badRequest, serverError } from '../helpers/http-helper'
import {
    IController,
    IEmailValidator,
    IHttpRequest,
    IHttpResponse,
} from '../protocols'
import { ServerError, InvalidParamError, MissingParamError } from '../errors'

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator

    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: IHttpRequest): IHttpResponse {
        try {
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
        } catch (error) {
            return serverError(new ServerError())
        }
    }
}
