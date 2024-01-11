import { IEncrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-acount'

interface ISutTypes {
    encrypterStub: IEncrypter
    sut: DbAddAccount
}

const makeEncrypter = (): IEncrypter => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return new Promise((resolve) => resolve('hashed_pwd'))
        }
    }
    return new EncrypterStub()
}

const makeSut = (): ISutTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)

    return {
        sut,
        encrypterStub,
    }
}

describe('DbAddAccount useCase', () => {
    test('Should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }

        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
})
