import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect('mongodb://127.0.0.1:27017/node-api')
    }, 5000)
    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
    describe('POST /signup', () => {
        test('Should return 200 on signup success', async () => {
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'Joao',
                    email: 'joao@gmail.com',
                    password: '123',
                    password_confirmation: '123'
                })
                .expect(200)
        })
    })
    describe('POST /login', () => {
        test('Should return 200 on login success', async () => {
            const password = await hash('123', 12)
            await accountCollection.insertOne({
                name: 'Joao',
                email: 'joao@gmail.com',
                password
            })
            await request(app)
                .post('/api/login')
                .send({
                    email: 'joao@gmail.com',
                    password: '123'
                })
                .expect(200)
        })
    })
})
