import { IHttpRequest, IValidation, IAddSurvey, IAddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'

const makeFakeRequest = (): IHttpRequest => ({
    body: {
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer'
            }
        ],
        date: new Date()
    }
})

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        validate(input: any): Error {
            return null as any
        }
    }
    return new ValidationStub()
}

const makeAddSurvey = (): IAddSurvey => {
    class AddSurveyStub implements IAddSurvey {
        async add(data: IAddSurveyModel): Promise<void> {
            return new Promise((resolve) => resolve())
        }
    }
    return new AddSurveyStub()
}

interface ISutTypes {
    sut: AddSurveyController
    validationStub: IValidation
    addSurveyStub: IAddSurvey
}

const makeSut = (): ISutTypes => {
    const validationStub = makeValidation()
    const addSurveyStub = makeAddSurvey()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return { sut, validationStub, addSurveyStub }
}

describe('Add Survey Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })
    afterAll(() => {
        MockDate.reset()
    })

    test('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation throws', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new Error()))
    })

    test('Should call AddSurvey with correct values', async () => {
        const { sut, addSurveyStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyStub, 'add')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 500 if AddSurvey throws', async () => {
        const { sut, addSurveyStub } = makeSut()
        jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 204 on success', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(noContent())
    })
})
