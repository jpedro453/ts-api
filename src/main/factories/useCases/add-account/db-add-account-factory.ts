import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { IAddAccount } from '../../../../domain/useCases/add-account'
import { DbAddAccount } from '../../../../data/useCases/add-account/db-add-acount'

export const makeDbAddAccount = (): IAddAccount => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
