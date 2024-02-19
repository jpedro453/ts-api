import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
    let errorCollection: Collection
    beforeAll(async () => {
        await MongoHelper.connect('mongodb://127.0.0.1:27017/node-api')
    }, 5000)
    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection('errors')
        await errorCollection.deleteMany({})
    })

    test('should create a error log on success', async () => {
        const sut = makeSut()
        await sut.logError('any_error')
        const count = await errorCollection.countDocuments()
        expect(count).toBe(1)
    })
})
