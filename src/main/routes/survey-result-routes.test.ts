import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAcessToken = async (): Promise<string> => {
    const res = await accountCollection.insertOne({
        name: 'Joao',
        email: 'joao@gmail.com',
        password: '123',
        role: 'admin'
    })
    const accountId = await MongoHelper.getCollectionItemById('accounts', res.insertedId)
    const id = accountId._id
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

    return accessToken
}

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
    describe('PUT /surveys/:survey_id/results', () => {
        test('Should return 403 on save survey result without acessToken', async () => {
            await request(app)
                .put('/api/surveys/any_id/results')
                .send({
                    answer: 'any_answer'
                })
                .expect(403)
        })

        test('Should return 200 on save survey result with acessToken', async () => {
            const accessToken = await makeAcessToken()
            const res = await surveyCollection.insertOne({
                question: 'Question Result',
                answers: [
                    {
                        image: 'http://image-name.com',
                        answer: 'Answer 1'
                    },
                    {
                        answer: 'Answer 2'
                    }
                ],
                date: new Date()
            })
            const resultID = await MongoHelper.getCollectionItemById('surveys', res.insertedId)
            const id = resultID._id
            await request(app)
                .put(`/api/surveys/${id}/results`)
                .set('x-access-token', accessToken)
                .send({
                    answer: 'Answer 1'
                })
                .expect(200)
        })
    })
    describe('GET /surveys/:survey_id/results', () => {
        test('Should return 403 on load survey result without accessToken', async () => {
            await request(app).get('/api/surveys/:survey_id/results').expect(403)
        })
        test('Should return 200 on load survey result with accessToken', async () => {
            const accessToken = await makeAcessToken()
            const res = await surveyCollection.insertOne({
                question: 'Question Result',
                answers: [
                    {
                        image: 'http://image-name.com',
                        answer: 'Answer 1'
                    },
                    {
                        answer: 'Answer 2'
                    }
                ],
                date: new Date()
            })
            const resultID = await MongoHelper.getCollectionItemById('surveys', res.insertedId)
            const id = resultID._id
            await request(app).get(`/api/surveys/${id}/results`).set('x-access-token', accessToken).expect(200)
        })
    })
})
