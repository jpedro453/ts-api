import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { ISurveyModel } from '@/domain/models/survey'
import { IAccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<ISurveyModel> => {
    const res = await surveyCollection.insertOne({
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
    const resultSurvey = await MongoHelper.getCollectionItemById('surveys', res.insertedId)
    return resultSurvey
}

const makeAccount = async (): Promise<IAccountModel> => {
    const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
    })
    const resultAccount = await MongoHelper.getCollectionItemById('accounts', res.insertedId)
    return resultAccount
}

describe('Survey Result Mongo Repository', () => {
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

        surveyResultCollection = await MongoHelper.getCollection('surveyResults')
        await surveyResultCollection.deleteMany({})

        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    describe('save()', () => {
        test('Should add an survey result if its new', async () => {
            const survey = await makeSurvey()
            const account = await makeAccount()

            const surveyMapped = MongoHelper.map(survey)
            const accountMapped = MongoHelper.map(account)

            const sut = makeSut()

            const surveyResult = await sut.save({
                survey_id: surveyMapped.id,
                account_id: accountMapped.id,
                answer: surveyMapped.answers[0].answer,
                date: new Date()
            })
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.survey_id).toEqual(surveyMapped.id)
            expect(surveyResult.answers[0].count).toBe(1)
            expect(surveyResult.answers[0].percent).toBe(100)
        })

        test('Should update an survey result if its not new', async () => {
            const survey = await makeSurvey()
            const account = await makeAccount()

            const surveyMapped = MongoHelper.map(survey)
            const accountMapped = MongoHelper.map(account)

            const res = await surveyResultCollection.insertOne({
                survey_id: new ObjectId(surveyMapped.id),
                account_id: new ObjectId(accountMapped.id),
                answer: surveyMapped.answers[0].answer,
                date: new Date()
            })

            const sut = makeSut()
            const surveyResult = await sut.save({
                survey_id: surveyMapped.id,
                account_id: accountMapped.id,
                answer: surveyMapped.answers[1].answer,
                date: new Date()
            })
            console.log(surveyResult.answers[0])
            console.log(surveyMapped.answers[1])
            const resultID = await MongoHelper.getCollectionItemById('surveyResults', res.insertedId)
            expect(surveyResult).toBeTruthy()
            expect(surveyResult.survey_id).toEqual(surveyMapped.id)
            expect(surveyResult.answers[0].answer).toBe(surveyMapped.answers[1].answer)
            expect(surveyResult.answers[0].count).toBe(1)
            expect(surveyResult.answers[0].percent).toBe(100)
        })
    })
})
