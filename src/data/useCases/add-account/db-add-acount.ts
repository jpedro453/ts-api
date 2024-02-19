import { ILoadAccountByEmailRepository } from '@/data/useCases/authentication/db-authentication-protocols'
import {
    IAccountModel,
    IAddAccount,
    IAddAccountModel,
    IAddAccountRepository,
    IHasher
} from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
    private readonly hasher: IHasher
    private readonly addAccountRepository: IAddAccountRepository
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository

    constructor(
        hasher: IHasher,
        addAccountRepository: IAddAccountRepository,
        loadAccountByEmailRepository: ILoadAccountByEmailRepository
    ) {
        this.hasher = hasher
        this.addAccountRepository = addAccountRepository
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
        const hashedPassword = await this.hasher.hash(accountData.password)

        const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

        if (!account) {
            const newAccount = await this.addAccountRepository.add(
                Object.assign({}, accountData, { password: hashedPassword })
            )

            return newAccount
        }

        return null
    }
}
