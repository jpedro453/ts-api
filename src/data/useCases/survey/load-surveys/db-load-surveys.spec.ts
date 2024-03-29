import { DbLoadSurveys } from './db-load-surveys'
import { ILoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { ISurveyModel } from '@/domain/models/survey'
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
const makeLoadSurveysRepository = (): ILoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements ILoadSurveysRepository {
        loadAll(): Promise<ISurveyModel[]> {
            return new Promise((resolve) => resolve(makeFakeSurveys()))
        }
    }
    return new LoadSurveysRepositoryStub()
}
interface ISutTypes {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: ILoadSurveysRepository
}

const makeSut = (): ISutTypes => {
    const loadSurveysRepositoryStub = makeLoadSurveysRepository()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    return { sut, loadSurveysRepositoryStub }
}

describe('LoadSurveys UseCase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })
    test('Should call LoadSurveysRepository', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
        await sut.load()
        expect(loadSpy).toHaveBeenCalled()
    })

    test('Should return a list of Surveys on LoadSurveysRepository success', async () => {
        const { sut } = makeSut()
        const surveys = await sut.load()
        expect(surveys).toEqual(makeFakeSurveys())
    })

    test('Should throw if LoadSurveysRepository throws', async () => {
        const { sut, loadSurveysRepositoryStub } = makeSut()
        jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.load()
        expect(promise).rejects.toThrow()
    })
})
