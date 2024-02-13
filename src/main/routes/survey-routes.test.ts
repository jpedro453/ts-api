import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

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
})
