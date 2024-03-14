import { ILoadSurveyById } from '@/domain/useCases/survey/load-survey-by-id'
import { IController, IHttpRequest } from '../../add-survey/add-survey-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { ISurveyModel } from '../../load-surveys/load-surveys.protocols'

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
    sut: IController
}

const makeSut = (): ISutTypes => {
    const loadSurveyByIdStub = makeLoadSurveyByIdStub()
    const sut = new LoadSurveyResultController(loadSurveyByIdStub)
    return { sut, loadSurveyByIdStub }
}

describe('LoadSurveyResult Controller', () => {
    test('Should call LoadSurveyById with correct value', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
        await sut.handle(makeFakeRequest())
        expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
    })
})
