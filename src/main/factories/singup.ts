import { SignUpController } from '../../presentation/controllers/signUp/signup'
import { DbAddAccount } from '../../data/useCases/add-account/db-add-acount'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { IController } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): IController => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const logErrorRepository = new LogMongoRepository()
    const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())

    return new LogControllerDecorator(signUpController, logErrorRepository)
}
