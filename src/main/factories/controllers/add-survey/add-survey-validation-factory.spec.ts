import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { IValidation } from '../../../../presentation/protocols/validator'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
jest.mock('../../../../validation/validators/validation-composite')

describe('Add Survey Validation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeAddSurveyValidation()
        const validations: IValidation[] = []
        for (const field of ['question', 'answers']) {
            validations.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
