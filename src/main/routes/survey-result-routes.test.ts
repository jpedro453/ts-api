import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

describe('Survey routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect('mongodb://127.0.0.1:27017/node-api')
    }, 5000)
    afterAll(async () => {
        await MongoHelper.disconnect()
    })
    describe('PUT /surveys/survey_id/results', () => {
        test('Should return 403 on save survey resut without acessToken', async () => {
            await request(app)
                .put('/api/surveys/any_id/results')
                .send({
                    answer: 'any_answer'
                })
                .expect(403)
        })
    })
})
