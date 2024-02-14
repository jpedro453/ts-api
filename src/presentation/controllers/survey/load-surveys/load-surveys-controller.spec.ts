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
        sut.handle({})
        expect(loadSpy).toHaveBeenCalled()
    })
})
