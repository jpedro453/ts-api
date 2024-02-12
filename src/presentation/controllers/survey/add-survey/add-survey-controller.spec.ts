import { IController, IHttpRequest, IHttpResponse, IValidation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
const makeFakeRequest = (): IHttpRequest => ({
    body: {
        question: 'any_question',
        answers: [
            {
                image: 'any_image',
                answer: 'any_answer'
            }
        ]
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

interface ISutTypes {
    sut: AddSurveyController
    validationStub: IValidation
}

const makeSut = (): ISutTypes => {
    const validationStub = makeValidation()
    const sut = new AddSurveyController(validationStub)
    return { sut, validationStub }
}

describe('Add Survey Controller', () => {
    test('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
