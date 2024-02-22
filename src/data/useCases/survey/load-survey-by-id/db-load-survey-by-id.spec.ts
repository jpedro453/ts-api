import { ISurveyModel } from '@/domain/models/survey'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { ILoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
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

const makeLoadSurveyByIdRepository = (): ILoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements ILoadSurveyByIdRepository {
        async loadById(id: string | any): Promise<ISurveyModel> {
            return new Promise((resolve) => resolve(makeFakeSurvey()))
        }
    }
    return new LoadSurveyByIdRepositoryStub()
}

interface ISutTypes {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: ILoadSurveyByIdRepository
}

const makeSut = (): ISutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return { sut, loadSurveyByIdRepositoryStub }
}

describe('Db Load Survey By ID', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should call LoadSurveyByIdRepository with correct ID', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        await sut.loadById('any_id')
        expect(loadSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should return a Survey on LoadSurveyByIdRepository success', async () => {
        const { sut } = makeSut()
        const survey = await sut.loadById('any_id')
        expect(survey).toEqual(makeFakeSurvey())
    })

    test('Should throw if LoadSurveyByIDRepository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.loadById('any_id')
        expect(promise).rejects.toThrow()
    })
})
