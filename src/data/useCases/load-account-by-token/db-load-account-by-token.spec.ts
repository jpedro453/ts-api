import { DbLoadAccountByToken } from './db-load-account-by-token'
import { IDecrypter } from '@/data/protocols/cryptography/decrypter'
import { IAccountModel } from '@/data/useCases/add-account/db-add-account-protocols'
import { ILoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

const makeFakeAccount = (): IAccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password'
})

const makeDecrypter = (): IDecrypter => {
    class DecrypterStub implements IDecrypter {
        async decrypt(value: string): Promise<string> {
            return new Promise((resolve) => resolve('any_token'))
        }
    }
    return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): ILoadAccountByTokenRepository => {
    class LoadAccountByTokenRepository implements ILoadAccountByTokenRepository {
        async loadByToken(token: string, role?: string): Promise<IAccountModel> {
            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByTokenRepository()
}

interface ISutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: IDecrypter
    loadAccountByTokenRepositoryStub: ILoadAccountByTokenRepository
}

const makeSut = (): ISutTypes => {
    const decrypterStub = makeDecrypter()
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
    return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DB Load Account By Token Use Case', () => {
    test('Should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token', 'any_role')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    })

    test('Should return null if Decrypter returns null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve) => resolve(null as any)))
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    })

    test('Should call LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
        await sut.load('any_token', 'any_role')
        expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
    })

    test('Should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(
            new Promise((resolve) => resolve(null as any))
        )
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.load('any_token', 'any_role')
        expect(account).toEqual(makeFakeAccount())
    })

    test('Should throw if Decrypter throws', async () => {
        const { sut, decrypterStub } = makeSut()

        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const promise = sut.load('any_token', 'any_role')
        await expect(promise).rejects.toThrow()
    })

    test('Should throw if LoadAccountByTokenRepository throws', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()

        jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.load('any_token', 'any_role')
        await expect(promise).rejects.toThrow()
    })
})
