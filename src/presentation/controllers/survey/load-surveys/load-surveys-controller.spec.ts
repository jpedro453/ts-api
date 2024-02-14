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

describe('Load Surveys Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })

    test('Should call LoadSurveys', async () => {
        class LoadSurveysStub implements ILoadSurveys {
            async load(): Promise<ISurveyModel[]> {
                return new Promise((resolve) => resolve(makeFakeSurveys()))
            }
        }
        const loadSurveysStub = new LoadSurveysStub()
        const loadSpy = jest.spyOn(loadSurveysStub, 'load')
        const sut = new LoadSurveysController(loadSurveysStub)
        sut.handle({})
        expect(loadSpy).toHaveBeenCalled()
    })
})
