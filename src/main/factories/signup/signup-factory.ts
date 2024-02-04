import { SignUpController } from '../../../presentation/controllers/signUp/signup-controller'
import { DbAddAccount } from '../../../data/useCases/add-account/db-add-acount'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeSignUpValidation } from './signup-validation-factory'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '../../../data/useCases/authentication/db-authentication-protocols'
import env from '../../config/env'

export const makeSignUpController = (): IController => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const dbAuthentication = new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository
    )
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const logErrorRepository = new LogMongoRepository()
    const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation(), dbAuthentication)

    return new LogControllerDecorator(signUpController, logErrorRepository)
}
