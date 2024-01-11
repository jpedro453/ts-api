import { badRequest, serverError } from '../helpers/http-helper'
import {
    IController,
    IEmailValidator,
    IHttpRequest,
    IHttpResponse,
} from '../protocols'
import { ServerError, InvalidParamError, MissingParamError } from '../errors'
import { IAddAccount } from '../../domain/useCases/add-account'

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator
    private readonly addAccount: IAddAccount

    constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
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
            const { name, email, password, password_confirmation } =
                httpRequest.body
            if (
                httpRequest.body.password !==
                httpRequest.body.password_confirmation
            ) {
                return badRequest(
                    new InvalidParamError('password_confirmation')
                )
            }

            if (!this.emailValidator.isValid(httpRequest.body.email)) {
                return badRequest(new InvalidParamError('email'))
            }

            this.addAccount.add({
                name,
                email,
                password,
            })
        } catch (error) {
            return serverError(new ServerError())
        }
    }
}
