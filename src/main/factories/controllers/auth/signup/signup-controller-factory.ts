import { SignUpController } from '@/presentation/controllers/auth/signUp/signup-controller'
import { IController } from '@/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/useCases/authentication/db-authenticatoin-factory'
import { makeDbAddAccount } from '@/main/factories/useCases/account/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeSignUpController = (): IController => {
    const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
    return makeLogControllerDecorator(controller)
}
