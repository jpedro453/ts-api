import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { ISaveSurveyResultModel } from '@/domain/useCases/save-survey-result'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'

const makeFakeSurveyResultData = (): ISaveSurveyResultModel => ({
    survey_id: 'any_survey_id',
    account_id: 'any_account_id',
    answer: 'any_answer',
    date: new Date()
})

const makeFakeSurveyResult = (): ISurveyResultModel =>
    Object.assign({}, makeFakeSurveyResultData(), {
        id: 'any_id'
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
})
