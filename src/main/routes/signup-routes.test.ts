import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Signup routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect('mongodb://127.0.0.1:27017/node-api')
    }, 5000)
    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
    test('Should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Joao',
                email: 'joao@gmail.com',
                password: '123',
                passwordConfirmation: '123'
            })
            .expect(200)
    })
})
