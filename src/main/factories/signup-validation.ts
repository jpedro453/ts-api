import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { IValidation } from '../../presentation/helpers/validators/validator'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'confirm_password']) {
        validations.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validations)
}
