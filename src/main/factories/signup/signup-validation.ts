import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { IValidation } from '../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'password_confirmation']) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'password_confirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}
