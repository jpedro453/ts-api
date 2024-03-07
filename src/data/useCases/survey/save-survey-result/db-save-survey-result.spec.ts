import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { ISaveSurveyResultModel } from '@/domain/useCases/survey/save-survey-result'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'

const makeFakeSurveyResultData = (): ISaveSurveyResultModel => ({
    survey_id: 'any_survey_id',
    account_id: 'any_account_id',
    answer: 'any_answer',
    date: new Date()
})

const makeFakeSurveyResult = (): ISurveyResultModel => ({
    survey_id: 'any_survey_id',
    question: 'any_question',
    answers: [
        {
            answer: 'any_answer',
            count: 1,
            percent: 50
        },
        {
            answer: 'other_answer',
            image: 'any_image',
            count: 1,
            percent: 50
        }
    ],
    date: new Date()
})

const makeSaveSurveyRepository = (): ISaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements ISaveSurveyResultRepository {
        async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
            return new Promise((resolve) => resolve(makeFakeSurveyResult()))
        }
    }
    return new SaveSurveyResultRepositoryStub()
}

interface ISutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: ISaveSurveyResultRepository
}

const makeSut = (): ISutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

    return { sut, saveSurveyResultRepositoryStub }
}

describe('DbSaveSurvey Use Case', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should call SaveSurveyResultRepository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
        const surveyResultData = makeFakeSurveyResultData()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test('Should throw if SaveSurveyResultRepository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()

        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const promise = sut.save(makeFakeSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test('Should return a SurveyResult on SaveSurveyResultRepository success', async () => {
        const { sut } = makeSut()
        const survey = await sut.save(makeFakeSurveyResultData())
        expect(survey).toEqual(makeFakeSurveyResult())
    })
})
