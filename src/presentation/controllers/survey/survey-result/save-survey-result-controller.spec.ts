import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IHttpRequest } from '../add-survey/add-survey-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { ISurveyModel } from '../load-surveys/load-surveys.protocols'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'

const makeFakeRequest = (): IHttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    }
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

const makeLoadSurveyById = (): ILoadSurveyById => {
    class LoadSurveyByIdStub implements ILoadSurveyById {
        async loadById(id: any): Promise<ISurveyModel> {
            return new Promise((resolve) => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdStub()
}

interface ISutTypes {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: ILoadSurveyById
}

const makeSut = (): ISutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyById()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub)
    return { sut, loadSurveyByIdStub }
}

describe('SaveSurveyResult Controller', () => {
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
})