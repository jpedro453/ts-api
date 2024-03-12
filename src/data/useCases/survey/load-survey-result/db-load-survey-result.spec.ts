import { ISurveyResultModel } from '@/domain/models/survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'

const makeFakeSurveyResult = (): ISurveyResultModel => ({
    survey_id: 'valid_survey_id',
    question: 'any_question',
    answers: [
        {
            answer: 'any_answer',
            count: 1,
            percent: 50
        },
        {
            answer: 'other_answer',
            count: 1,
            percent: 50
        }
    ],
    date: new Date()
})

const makeLoadSurveyResultRepositoryStub = (): ILoadSurveyResultRepository => {
    class LoadSurveyResultRepositoryStub implements ILoadSurveyResultRepository {
        async loadBySurveyId(surveyId: string): Promise<ISurveyResultModel> {
            return Promise.resolve(makeFakeSurveyResult())
        }
    }
    return new LoadSurveyResultRepositoryStub()
}

interface ISutTypes {
    loadSurveyResultRepositoryStub: ILoadSurveyResultRepository
    sut: DbLoadSurveyResult
}

const makeSut = (): ISutTypes => {
    const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

    return { sut, loadSurveyResultRepositoryStub }
}

describe('DbLoadSurveyResultUseCase', () => {
    test('Should call LoadSurveyResultRepository', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()

        const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

        await sut.load('any_survey_id')

        expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
    })

    test('Should throw if LoadSurveyResultRepository throws', async () => {
        const { sut, loadSurveyResultRepositoryStub } = makeSut()

        jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.load('any_survey_id')
        await expect(promise).rejects.toThrow()
    })
})
