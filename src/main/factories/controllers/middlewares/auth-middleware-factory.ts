import { AuthMiddleware } from '../../../../presentation/middlewares/auth-middleware'
import { IMiddleware } from '../../../../presentation/protocols'
import { makeDbLoadAccountByToken } from '../../useCases/account/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string): IMiddleware => {
    return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
