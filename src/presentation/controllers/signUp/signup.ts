import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse, IEmailValidator, IAddAccount, IValidation } from './signup-protocols'

import { ServerError, InvalidParamError, MissingParamError } from '../../errors'

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator
    private readonly addAccount: IAddAccount
    private readonly validation: IValidation

    constructor(emailValidator: IEmailValidator, addAccount: IAddAccount, validation: IValidation) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
        this.validation = validation
    }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }

            const requiredFields = ['name', 'email', 'password', 'password_confirmation']

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const { id, name, email, password, password_confirmation } = httpRequest.body

            if (password != password_confirmation) {
                return badRequest(new InvalidParamError('password_confirmation'))
            }

            if (!this.emailValidator.isValid(httpRequest.body.email)) {
                return badRequest(new InvalidParamError('email'))
            }

            const account = await this.addAccount.add({
                name,
                email,
                password
            })

            return ok(account)
        } catch (error) {
            return serverError(error)
        }
    }
}
