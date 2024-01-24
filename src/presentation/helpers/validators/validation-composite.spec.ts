import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { IValidation } from './validator'

interface ISutTypes {
    sut: ValidationComposite
    validationStubs: IValidation[]
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
    const validationStubs = [makeValidation(), makeValidation()]
    const sut = new ValidationComposite(validationStubs)
    return { sut, validationStubs }
}

describe('Validation Composite', () => {
    test('Should return an error if any validations fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValue(new MissingParamError('field'))
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })
    test('Should return the first error if more than one validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValue(new Error())
        jest.spyOn(validationStubs[1], 'validate').mockReturnValue(new MissingParamError('field'))
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new Error())
    })
})
