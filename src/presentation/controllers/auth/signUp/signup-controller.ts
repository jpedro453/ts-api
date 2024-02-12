import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import {
    IController,
    IHttpRequest,
    IHttpResponse,
    IEmailValidator,
    IAddAccount,
    IValidation
} from './signup-controller-protocols'

import { ServerError, InvalidParamError, MissingParamError, EmailInUseError } from '../../../errors'
import { IAuthentication } from '../login/login-controller-protocols'

export class SignUpController implements IController {
    private readonly addAccount: IAddAccount
    private readonly validation: IValidation
    private readonly authentication: IAuthentication

    constructor(addAccount: IAddAccount, validation: IValidation, authentication: IAuthentication) {
        this.addAccount = addAccount
        this.validation = validation
        this.authentication = authentication
    }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }
            const { name, email, password } = httpRequest.body

            const account = await this.addAccount.add({
                name,
                email,
                password
            })
            if (!account) {
                return forbidden(new EmailInUseError())
            }
            const accessToken = await this.authentication.auth({ email, password })

            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}
