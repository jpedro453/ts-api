import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { IValidation } from './validator'

describe('Validation Composite', () => {
    test('Should return an error if any validations fails', () => {
        class ValidationStub implements IValidation {
            validate(input: any): Error {
                return new MissingParamError('field')
            }
        }
        const validationStub = new ValidationStub()
        const sut = new ValidationComposite([validationStub])
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })
})
