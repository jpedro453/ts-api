import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { IValidation } from './validator'

interface ISutTypes {
    sut: ValidationComposite
    validationStub: IValidation
}

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeSut = (): ISutTypes => {
    const validationStub = makeValidation()
    const sut = new ValidationComposite([validationStub])
    return { sut, validationStub }
}

describe('Validation Composite', () => {
    test('Should return an error if any validations fails', () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('field'))
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })
})
