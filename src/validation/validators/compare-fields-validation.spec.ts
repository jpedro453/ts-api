import { InvalidParamError, MissingParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    return sut
}

describe('Compare Fields Validation', () => {
    test('Should return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_name', fieldToCompare: 'false_name' })
        expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })
    test('Should not return a InvalidParamError if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_name', fieldToCompare: 'any_name' })
        expect(error).toBeFalsy()
    })
})
