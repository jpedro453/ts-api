import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveysController, ISurveyModel, ILoadSurveys } from './load-surveys.protocols'
import MockDate from 'mockdate'

const makeFakeSurveys = (): ISurveyModel[] => {
    return [
        {
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
    ]
}

const makeLoadSurveys = (): ILoadSurveys => {
    class LoadSurveysStub implements ILoadSurveys {
        async load(): Promise<ISurveyModel[]> {
            return new Promise((resolve) => resolve(makeFakeSurveys()))
        }
    }
    return new LoadSurveysStub()
}

interface ISutTypes {
    sut: LoadSurveysController
    loadSurveysStub: ILoadSurveys
}

const makeSut = (): ISutTypes => {
    const loadSurveysStub = makeLoadSurveys()
    const sut = new LoadSurveysController(loadSurveysStub)

    return { sut, loadSurveysStub }
}

describe('Load Surveys Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })

    test('Should call LoadSurveys', async () => {
        const { sut, loadSurveysStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveysStub, 'load')
        await sut.handle({})
        expect(loadSpy).toHaveBeenCalled()
    })

    test('Should return 200 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(ok(makeFakeSurveys()))
    })

    test('Should return 204 if LoadSurveys returns empty', async () => {
        const { sut, loadSurveysStub } = makeSut()
        jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve([])))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(noContent())
    })

    test('Should return 500 if LoadSurveys throws', async () => {
        const { sut, loadSurveysStub } = makeSut()
        jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
