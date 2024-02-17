import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect('mongodb://127.0.0.1:27017/node-api')
    }, 5000)
    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
    describe('POST /surveys', () => {
        test('Should return 403 on add survey without acessToken', async () => {
            await request(app)
                .post('/api/surveys')
                .send({
                    question: 'Question',
                    answers: [
                        {
                            image: 'http://image-name.com',
                            answer: 'Answer 1'
                        },
                        {
                            answer: 'Answer 2'
                        }
                    ]
                })
                .expect(403)
        })
    })

    describe('GET /surveys', () => {
        test('Should return 403 on load survey without accessToken', async () => {
            await request(app).get('/api/surveys').expect(403)
        })

        test('Should return 200 on load surveys if valid accessToken', async () => {
            const res = await accountCollection.insertOne({
                name: 'Joao',
                email: 'joao@gmail.com',
                password: '123'
            })
            const accountId = await MongoHelper.getCollectionItemById('accounts', res.insertedId)
            const id = accountId._id
            const accessToken = sign({ id }, env.jwtSecret)
            await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

            await surveyCollection.insertMany([
                {
                    question: 'any_question',
                    answers: [
                        {
                            image: 'any_image',
                            answer: 'any_answer'
                        },
                        {
                            answer: 'other_answer'
                        }
                    ],
                    date: new Date()
                }
            ])

            await request(app).get('/api/surveys').set('x-access-token', accessToken).expect(200)
        })
    })
})
