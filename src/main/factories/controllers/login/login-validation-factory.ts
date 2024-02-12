import {
    EmailValidation,
    RequiredFieldValidation,
    ValidationComposite
} from '../../../../presentation/helpers/validators'
import { IValidation } from '../../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
    const validations: IValidation[] = []
    for (const field of ['email', 'password']) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}