import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { IAuthentication, IAuthenticationModel } from '../../../domain/useCases/authentication'

export class DbAuthentication implements IAuthentication {
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository

    constructor(loadAccountByEmailRepository: ILoadAccountByEmailRepository) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async auth(authentication: IAuthenticationModel): Promise<string> {
        await this.loadAccountByEmailRepository.load(authentication.email)
        return null
    }
}
