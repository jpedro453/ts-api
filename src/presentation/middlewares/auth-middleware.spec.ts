import { IHttpRequest } from '../protocols'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { ILoadAccountByToken } from '../../domain/useCases/load-account-by-token'
import { IAccountModel } from '../../domain/models/account'

const makeFakeAccount = (): IAccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password'
})
const makeFakeRequest = (): IHttpRequest => ({
    headers: {
        'x-access-token': 'any_token'
    }
})

const makeLoadAccountByTokenStub = (): ILoadAccountByToken => {
    class LoadAccountByToken implements ILoadAccountByToken {
        async load(accessToken: string, role?: string | undefined): Promise<IAccountModel> {
            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByToken()
}

interface ISutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: ILoadAccountByToken
}

const makeSut = (): ISutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    return { sut, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {
    test('Should return 403 if no x-access-token exists in header', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should call LoadAccountByToken with correct accessToken', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(makeFakeRequest())
        expect(loadSpy).toHaveBeenCalledWith('any_token')
    })
})
