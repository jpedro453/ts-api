import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { IValidation } from '../../presentation/helpers/validators/validator'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('Signup Validation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: IValidation[] = []
        for (const field of ['name', 'email', 'password', 'confirm_password']) {
            validations.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
