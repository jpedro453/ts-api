import { IController, IHttpRequest, IHttpResponse, IAuthentication } from './login-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { IValidation } from '../../helpers/validators/validator'

export class LoginController implements IController {
    private readonly authentication: IAuthentication
    private readonly validation: IValidation

    constructor(authentication: IAuthentication, validation: IValidation) {
        this.validation = validation
        this.authentication = authentication
    }

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { email, password } = httpRequest.body

            const accessToken = await this.authentication.auth(email, password)
            if (!accessToken) {
                return unauthorized()
            }
            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}
