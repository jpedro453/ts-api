import {
    CompareFieldsValidation,
    EmailValidation,
    RequiredFieldValidation,
    ValidationComposite
} from '../../../../../validation/validators'
import { IValidation } from '../../../../../presentation/protocols/validator'
import { IEmailValidator } from '../../../../../validation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('Signup Validation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations: IValidation[] = []
        for (const field of ['name', 'email', 'password', 'password_confirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'password_confirmation'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
