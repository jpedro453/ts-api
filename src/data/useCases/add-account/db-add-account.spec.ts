import { IEncrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-acount'

describe('DbAddAccount useCase', () => {
    test('Should call encrypter with correct password', async () => {
        class EncrypterStub {
            async encrypt(value: string): Promise<string> {
                return new Promise((resolve) => resolve('hashed_pwd'))
            }
        }

        const encrypterStub = new EncrypterStub()

        const sut = new DbAddAccount(encrypterStub)

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
