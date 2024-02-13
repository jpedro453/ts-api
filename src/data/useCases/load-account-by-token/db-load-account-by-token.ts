import { ILoadAccountByToken } from '../../../domain/useCases/load-account-by-token'
import { IDecrypter } from '../../protocols/cryptography/decrypter'
import { IAccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements ILoadAccountByToken {
    constructor(private readonly decrypter: IDecrypter) {}

    async load(accessToken: string, role?: string): Promise<IAccountModel> {
        await this.decrypter.decrypt(accessToken)
        return null
    }
}
