import { InvalidParamError, MissingParamError } from '../../errors'
import { IEmailValidator } from '../../protocols/email-validator'
import { badRequest } from '../http/http-helper'
import { IValidation } from './validator'

export class EmailValidation implements IValidation {
    private readonly fieldName: string
    private readonly emailValidator: IEmailValidator

    constructor(fieldName: string, emailValidator: IEmailValidator) {
        this.fieldName = fieldName
        this.emailValidator = emailValidator
    }

    validate(input: any): Error {
        const isValid = this.emailValidator.isValid(input[this.fieldName])
        if (!isValid) {
            return new InvalidParamError(this.fieldName)
        }
    }
}
