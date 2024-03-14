import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest } from '../../add-survey/add-survey-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { ISurveyModel } from '../../load-surveys/load-surveys.protocols'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { ISurveyResultModel } from '@/domain/models/survey-result'
import { ILoadSurveyResult } from '@/domain/useCases/survey/load-survey-result'

const makeFakeRequest = (): IHttpRequest => ({
    params: {
        survey_id: 'any_survey_id'
    }
})

const makeFakeSurvey = (): ISurveyModel => {
    return {
        id: 'any_survey_id',
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
            count: 0,
            percent: 0
        },
        {
            answer: 'other_answer',
            count: 0,
            percent: 0
        }
    ],
    date: new Date()
})

const makeLoadSurveyResultStub = (): ILoadSurveyResult => {
    class LoadSurveyResultStub implements ILoadSurveyResult {
        async load(survey_id: string): Promise<ISurveyResultModel> {
            return Promise.resolve(makeFakeSurveyResult())
        }
    }
    return new LoadSurveyResultStub()
}

const makeLoadSurveyByIdStub = (): ILoadSurveyById => {
    class loadSurveyByIdStub implements ILoadSurveyById {
        async loadById(id: any): Promise<ISurveyModel> {
            return Promise.resolve(makeFakeSurvey())
        }
    }
    return new loadSurveyByIdStub()
}

interface ISutTypes {
    loadSurveyByIdStub: ILoadSurveyById
    loadSurveyResultStub: ILoadSurveyResult
    sut: IController
}

const makeSut = (): ISutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyByIdStub()
    const loadSurveyResultStub = makeLoadSurveyResultStub()
    const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
    return { sut, loadSurveyByIdStub, loadSurveyResultStub }
}

describe('LoadSurveyResult Controller', () => {
    test('Should call LoadSurveyById with correct value', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
        await sut.handle(makeFakeRequest())
        expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })
    test('Should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
        const response = await sut.handle(makeFakeRequest())
        expect(response).toEqual(forbidden(new InvalidParamError('survey_id')))
    })
    test('Should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
        const response = await sut.handle(makeFakeRequest())
        expect(response).toEqual(serverError(new Error()))
    })
    test('Should call LoadSurveyResult with correct values', async () => {
        const { sut, loadSurveyResultStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
        await sut.handle(makeFakeRequest())
        expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
    })
})
