import { MissingParamError } from '@/presentation/errors'
import { IValidation } from '@/presentation/protocols/validator'

export class RequiredFieldValidation implements IValidation {
    private readonly fieldName: string
    constructor(fieldName: string) {
        this.fieldName = fieldName
    }

    validate(input: any): Error {
        if (!input[this.fieldName]) {
            return new MissingParamError(this.fieldName)
        }
    }
}
