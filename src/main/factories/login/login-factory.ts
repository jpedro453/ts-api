import { DbAuthentication } from '../../../data/useCases/authentication/db-authentication'
import env from '../../config/env'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): IController => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAuthentication = new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository
    )
    const loginController = new LoginController(dbAuthentication, makeLoginValidation())
    const logErrorRepository = new LogMongoRepository()
    return new LogControllerDecorator(loginController, logErrorRepository)
}
