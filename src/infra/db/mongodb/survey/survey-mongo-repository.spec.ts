import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect('mongodb://127.0.0.1:27017/node-api')
        MockDate.set(new Date())
    }, 5000)
    afterAll(async () => {
        await MongoHelper.disconnect()
        MockDate.reset()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
    })

    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository()
    }

    test('Should add an survey on success', async () => {
        const sut = makeSut()
        await sut.add({
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
        })
        const survey = await surveyCollection.findOne({ question: 'any_question' })
        expect(survey).toBeTruthy()
    })
})
