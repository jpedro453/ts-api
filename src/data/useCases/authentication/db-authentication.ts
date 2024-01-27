import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IAuthentication, IAuthenticationModel } from '../../../domain/useCases/authentication'
import { IHashComparer } from '../../protocols/cryptography/hash-comparer'
import { ITokenGenerator } from '../../protocols/cryptography/token-generator'
import { IUpdateAccessTokenRepository } from '../../protocols/db/update-acess-token-repository'

export class DbAuthentication implements IAuthentication {
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
    private readonly hashComparer: IHashComparer
    private readonly tokenGenerator: ITokenGenerator
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository

    constructor(
        loadAccountByEmailRepository: ILoadAccountByEmailRepository,
        hashComparer: IHashComparer,
        tokenGenerator: ITokenGenerator,
        updateAccessTokenRepository: IUpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashComparer = hashComparer
        this.tokenGenerator = tokenGenerator
        this.updateAccessTokenRepository = updateAccessTokenRepository
    }

    async auth(authentication: IAuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)

        if (account) {
            const isValid = await this.hashComparer.compare(authentication.password, account.password)

            if (isValid) {
                const accessToken = await this.tokenGenerator.generate(account.id)
                await this.updateAccessTokenRepository.update(account.id, accessToken)
                return accessToken
            }
        }
        return null
    }
}
