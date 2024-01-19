import { MongoHelper as sut } from './mongo-helper'

describe('MongoHelper', () => {
    beforeAll(async () => {
        await sut.connect('mongodb://127.0.0.1:27017/node-api')
    })

    afterAll(async () => {
        await sut.disconnect()
    })

    test('Should reconnect  if mongoDB is down', async () => {
        let accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()

        await sut.disconnect()

        accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
    })
})
