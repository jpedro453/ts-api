import { IAuthentication } from '../../../domain/useCases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'
import { IEmailValidator } from '../../protocols/email-validator'

export class LoginController implements IController {
    private readonly emailValidator: IEmailValidator
    private readonly authentication: IAuthentication

    constructor(emailValidator: IEmailValidator, authentication: IAuthentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const requiredFields = ['email', 'password']

            const { email, password } = httpRequest.body

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const emailIsValid = this.emailValidator.isValid(email)

            if (!emailIsValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const accessToken = await this.authentication.auth(email, password)
            if (!accessToken) {
                return unauthorized()
            }
        } catch (error) {
            return serverError(error)
        }
    }
}
