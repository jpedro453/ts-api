import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect('mongodb://127.0.0.1:27017/node-api')
    }, 5000)
    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository()
    }

    it('should return an account on succes', async () => {
        const sut = makeSut()
        const account = await sut.add({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        })
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_email@email.com')
        expect(account.password).toBe('any_password')
    })
})
