import { DbLoadAccountByToken } from './db-load-account-by-token'
import { IDecrypter } from '../../protocols/cryptography/decrypter'

const makeDecrypter = (): IDecrypter => {
    class DecrypterStub implements IDecrypter {
        async decrypt(value: string): Promise<string> {
            return new Promise((resolve) => resolve('any_value'))
        }
    }
    return new DecrypterStub()
}

interface ISutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: IDecrypter
}

const makeSut = (): ISutTypes => {
    const decrypterStub = makeDecrypter()
    const sut = new DbLoadAccountByToken(decrypterStub)
    return { sut, decrypterStub }
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
})
