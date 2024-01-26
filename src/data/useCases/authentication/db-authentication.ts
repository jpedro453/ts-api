import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IAuthentication, IAuthenticationModel } from '../../../domain/useCases/authentication'
import { IHashComparer } from '../../protocols/cryptography/hash-comparer'
import { ITokenGenerator } from '../../protocols/cryptography/token-generator'

export class DbAuthentication implements IAuthentication {
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
    private readonly hashComparer: IHashComparer
    private readonly tokenGenerator: ITokenGenerator

    constructor(
        loadAccountByEmailRepository: ILoadAccountByEmailRepository,
        hashComparer: IHashComparer,
        tokenGenerator: ITokenGenerator
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashComparer = hashComparer
        this.tokenGenerator = tokenGenerator
    }

    async auth(authentication: IAuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)

        if (account) {
            const isValid = await this.hashComparer.compare(authentication.password, account.password)

            if (isValid) {
                const accessToken = await this.tokenGenerator.generate(account.id)
                return accessToken
            }
        }
        return null
    }
}
