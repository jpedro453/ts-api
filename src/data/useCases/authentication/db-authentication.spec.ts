import { IAccountModel } from '../add-account/db-add-account-protocols'
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DB Authentication Use Case', () => {
    test('Should call LoadAcccountByEmailRepository with correct email', async () => {
        class LoadAcccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
            async load(email: string): Promise<IAccountModel> {
                const account: IAccountModel = {
                    id: 'any_id',
                    name: 'any_name',
                    email: 'any_email@email.com',
                    password: 'any_password'
                }
                return new Promise((resolve) => resolve(account))
            }
        }

        const loadAcccountByEmailRepositoryStub = new LoadAcccountByEmailRepositoryStub()
        const sut = new DbAuthentication(loadAcccountByEmailRepositoryStub)
        const loadSpy = jest.spyOn(loadAcccountByEmailRepositoryStub, 'load')
        await sut.auth({
            email: 'any_email@email.com',
            password: 'any_password'
        })
        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    })
})
