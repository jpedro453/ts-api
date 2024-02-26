import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IHttpRequest } from '../add-survey/add-survey-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { ISurveyModel } from '../load-surveys/load-surveys.protocols'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'
import { ISaveSurveyResult, ISaveSurveyResultModel } from '@/domain/useCases/survey/save-survey-result'
import { ISurveyResultModel } from '@/domain/models/survey-result'

const makeFakeRequest = (): IHttpRequest => ({
    params: {
        survey_id: 'any_survey_id'
    },
    body: {
        answer: 'any_answer'
    },
    account_id: 'any_account_id'
})

const makeFakeSurvey = (): ISurveyModel => ({
    id: 'any_id',
    question: 'any_question',
    answers: [
        {
            image: 'any_image',
            answer: 'any_answer'
        }
    ],
    date: new Date()
})

const makeFakeSurveyResult = (): ISurveyResultModel => ({
    id: 'valid_id',
    survey_id: 'valid_survey_id',
    account_id: 'valid_account_id',
    answer: 'valid_answer',
    date: new Date()
})

const makeLoadSurveyById = (): ILoadSurveyById => {
    class LoadSurveyByIdStub implements ILoadSurveyById {
        async loadById(id: any): Promise<ISurveyModel> {
            return new Promise((resolve) => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdStub()
}
const makeSurveyResult = (): ISaveSurveyResult => {
    class SaveSurveyResultStub implements ISaveSurveyResult {
        async save(data: ISaveSurveyResultModel): Promise<ISurveyResultModel> {
            return new Promise((resolve) => resolve(makeFakeSurveyResult()))
        }
    }
    return new SaveSurveyResultStub()
}

interface ISutTypes {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: ILoadSurveyById
    saveSurveyResultStub: ISaveSurveyResult
}

const makeSut = (): ISutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const saveSurveyResultStub = makeSurveyResult()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
    return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

describe('SaveSurveyResult Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test('Should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
        await sut.handle(makeFakeRequest())
        expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })

    test('Should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new InvalidParamError('SurveyID')))
    })

    test('Should return 500 if LoadSurveyById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 403 if and invalid answer is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({
            params: {
                surveyId: 'any_survey_id'
            },
            body: {
                answer: 'wrong_answer'
            }
        })
        expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
    })

    test('Should call SaveSurveyResult with correct values', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
        const res = await sut.handle(makeFakeRequest())
        console.log(res)
        expect(saveSpy).toHaveBeenCalledWith({
            survey_id: 'any_survey_id',
            account_id: 'any_account_id',
            answer: 'any_answer',
            date: new Date()
        })
    })

    test('Should return 500 if SaveSurveyResult throws', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
