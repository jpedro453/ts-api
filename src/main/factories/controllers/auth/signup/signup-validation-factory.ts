import { CompareFieldsValidation } from '../../../../../validation/validators/compare-fields-validation'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { IValidation } from '../../../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'password_confirmation']) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'password_confirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}
