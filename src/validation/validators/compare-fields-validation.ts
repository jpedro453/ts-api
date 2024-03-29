import { InvalidParamError } from '@/presentation/errors'
import { IValidation } from '@/presentation/protocols/validator'

export class CompareFieldsValidation implements IValidation {
    private readonly fieldName: string
    private readonly fieldToCompareName: string

    constructor(fieldName: string, fieldToCompareName: string) {
        this.fieldName = fieldName
        this.fieldToCompareName = fieldToCompareName
    }

    validate(input: any): Error {
        if (input[this.fieldName] !== input[this.fieldToCompareName]) {
            return new InvalidParamError(this.fieldToCompareName)
        }
    }
}
