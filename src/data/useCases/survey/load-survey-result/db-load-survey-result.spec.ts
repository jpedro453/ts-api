import { ISurveyResultModel } from '@/domain/models/survey-result'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { ILoadSurveyResultRepository } from '@/data/protocols/db/survey/load-survey-result-repository'
import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { ISurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'

const makeFakeSurvey = (): ISurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer'
            }
        ],
        date: new Date()
    }
}

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

const makeLoadSurveyByIdRepository = (): ILoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements ILoadSurveyByIdRepository {
        async loadById(id: string | any): Promise<ISurveyModel> {
            return new Promise((resolve) => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdRepositoryStub()
}

interface ISutTypes {
    loadSurveyResultRepositoryStub: ILoadSurveyResultRepository
    loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository
    sut: DbLoadSurveyResult
}

const makeSut = (): ISutTypes => {
    const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub()
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

    return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyResultUseCase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
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

    test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
        const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
        const surveyResult = await sut.load('valid_survey_id')
        expect(loadByIdSpy).toHaveBeenCalledWith('valid_survey_id')
    })

    test('Should return a SurveyResultModel on success', async () => {
        const { sut } = makeSut()

        const surveyResult = await sut.load('valid_survey_id')
        expect(surveyResult).toEqual(makeFakeSurveyResult())
    })
})
