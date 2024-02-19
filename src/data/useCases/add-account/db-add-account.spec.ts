import { DbAddAccount } from './db-add-acount'
import { IAccountModel, IAddAccountModel, IHasher, IAddAccountRepository } from './db-add-account-protocols'
import { ILoadAccountByEmailRepository } from '@/data/useCases/authentication/db-authentication-protocols'

interface ISutTypes {
    hasherStub: IHasher
    sut: DbAddAccount
    addAccountRepositoryStub: IAddAccountRepository
    loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
}

const makeFakeAccountData = () => ({
    id: 'any_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
})

const makeHasher = (): IHasher => {
    class HasherStub {
        async hash(value: string): Promise<string> {
            return new Promise((resolve) => resolve('hashed_pwd'))
        }
    }
    return new HasherStub()
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<IAccountModel> {
            return new Promise((resolve) => resolve(null as any))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepository = (): IAddAccountRepository => {
    class AddAccountRepositoryStub implements IAddAccountRepository {
        async add(accountData: IAddAccountModel): Promise<IAccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'hashed_pwd'
            }
            return new Promise((resolve) => resolve(fakeAccount))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeSut = (): ISutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbAddAccount useCase', () => {
    test('Should call hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut()

        const hashSpy = jest.spyOn(hasherStub, 'hash')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        await sut.add(accountData)
        expect(hashSpy).toHaveBeenCalledWith('valid_password')
    })
    test('Should throw if hasher throws', async () => {
        const { sut, hasherStub } = makeSut()

        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
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
            password: 'valid_password'
        }

        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_pwd'
        })
    })
    test('Should throw if hasher throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()

        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'invalid_password'
        }

        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
    test('Should return an Account on success', async () => {
        const { sut } = makeSut()

        const accountData = {
            name: 'valid_name',
            email: 'valid_email',
            password: 'valid_password'
        }

        const account = await sut.add(accountData)
        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email',
            password: 'hashed_pwd'
        })
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
            new Promise((resolve) => resolve(makeFakeAccountData()))
        )
        const account = await sut.add(makeFakeAccountData())
        expect(account).toBeNull()
    })

    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(makeFakeAccountData())
        expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com')
    })
})
