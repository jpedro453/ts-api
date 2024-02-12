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

describe('Add Survey Controller', () => {
    test('Should call Validation with correct values', async () => {
        class ValidationStub implements IValidation {
            validate(input: any): Error {
                return null as any
            }
        }
        const validationStub = new ValidationStub()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const sut = new AddSurveyController(validationStub)
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
