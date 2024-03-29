import { DbLoadAccountByToken } from '@/data/useCases/account/load-account-by-token/db-load-account-by-token'
import env from '@/main/config/env'
import { ILoadAccountByToken } from '@/domain/useCases/account/load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbLoadAccountByToken = (): ILoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
