import { DbAddAccount } from './db-add-acount'
import {
    IAccountModel,
    IAddAccount,
    IAddAccountModel,
    IEncrypter,
    IAddAccountRepository,
} from './db-add-account-protocols'

interface ISutTypes {
    encrypterStub: IEncrypter
    sut: DbAddAccount
    addAccountRepositoryStub: IAddAccountRepository
}

const makeEncrypter = (): IEncrypter => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return new Promise((resolve) => resolve('hashed_pwd'))
        }
    }
    return new EncrypterStub()
}

const makeAddAccountRepository = (): IAddAccountRepository => {
    class AddAccountRepositoryStub implements IAddAccountRepository {
        async add(accountData: IAddAccountModel): Promise<IAccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'hashed_pwd',
            }
            return new Promise((resolve) => resolve(fakeAccount))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeSut = (): ISutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub,
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
    test('Should throw if encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()

        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }

        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()

        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password',
        }

        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_pwd',
        })
    })
    test('Should throw if encrypter throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()

        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'invalid_password',
        }

        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
})
