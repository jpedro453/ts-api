import { EmailValidation } from './email-validation'
import { InvalidParamError, ServerError } from '../../errors'
import { IEmailValidator } from '../../controllers/signUp/signup-protocols'
import { serverError } from '../http-helper'

interface ISutTypes {
    sut: EmailValidation
    emailValidatorStub: IEmailValidator
}

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeSut = (): ISutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new EmailValidation('email', emailValidatorStub)

    return {
        sut,
        emailValidatorStub
    }
}

describe('SignUp Controller', () => {
    test('Should return an error if email validator returns false', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const error = sut.validate({ email: 'any_email@mail.com' })
        expect(error).toEqual(new InvalidParamError('email'))
    })
    test('Should call emailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        sut.validate({ email: 'any_email@mail.com' })

        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
    test('Should throw if email validator throws', () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        expect(sut.validate).toThrow()
    })
})
