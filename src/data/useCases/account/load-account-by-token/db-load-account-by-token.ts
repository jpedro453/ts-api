import { ILoadAccountByToken } from '@/domain/useCases/load-account-by-token'
import { IDecrypter } from '@/data/protocols/cryptography/decrypter'
import { ILoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { IAccountModel } from '@/data/useCases/account/add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements ILoadAccountByToken {
    constructor(
        private readonly decrypter: IDecrypter,
        private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
    ) {}

    async load(accessToken: string, role?: string): Promise<IAccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if (token) {
            const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
            if (account) {
                return account
            }
        }
        return null
    }
}
