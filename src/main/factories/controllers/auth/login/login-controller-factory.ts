import { LoginController } from '@/presentation/controllers/auth/login/login-controller'
import { IController } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/useCases/authentication/db-authenticatoin-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): IController => {
    return makeLogControllerDecorator(new LoginController(makeDbAuthentication(), makeLoginValidation()))
}
