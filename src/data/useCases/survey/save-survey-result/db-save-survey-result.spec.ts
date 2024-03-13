import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'
import { ISaveSurveyResultModel } from '@/domain/useCases/survey/save-survey-result'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ISaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'

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
        async save(data: ISaveSurveyResultModel): Promise<void> {
            return new Promise((resolve) => resolve())
        }
    }
    return new SaveSurveyResultRepositoryStub()
}

const makeLoadSurveyRepository = (): ILoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements ILoadSurveyResultRepository {
        async loadBySurveyId(surveyId: string): Promise<ISurveyResultModel> {
            return new Promise((resolve) => resolve(makeFakeSurveyResult()))
        }
    }
    return new LoadSurveyResultRepositoryStub()
}

interface ISutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: ISaveSurveyResultRepository
    loadSurveyResultRepositoryStub: ILoadSurveyResultRepository
}

const makeSut = (): ISutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyRepository()
    const loadSurveyResultRepositoryStub = makeLoadSurveyRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

    return { sut, saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub }
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

    test('Should call LoadSurveyResultRepository with correct values', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        const surveyResultData = makeFakeSurveyResultData()
        await sut.save(surveyResultData)
        expect(loadSpy).toHaveBeenCalledWith(surveyResultData.survey_id)
    })

    test('Should throw if LoadSurveyResultRepository throws', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()

        jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(
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
