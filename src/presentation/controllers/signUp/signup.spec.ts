import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import {
    IEmailValidator,
    IAddAccountModel,
    IAddAccount,
    IAccountModel,
    IHttpRequest,
    IValidation
} from './signup-protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

interface ISutTypes {
    sut: SignUpController
    emailValidatorStub: IEmailValidator
    addAccountStub: IAddAccount
    validationStub: IValidation
}

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}
const makeAddAccount = (): IAddAccount => {
    class AddAccountStub implements IAddAccount {
        async add(account: IAddAccountModel): Promise<IAccountModel> {
            return new Promise((resolve) => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountStub()
}
const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeFakeAccount = (): IAccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeFakeRequest = (): IHttpRequest => ({
    body: {
        name: 'name',
        email: 'any_email@mail.com',
        password: 'pwd',
        password_confirmation: 'pwd'
    }
})

const makeSut = (): ISutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const validationStub = makeValidation()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

    return {
        sut,
        emailValidatorStub,
        addAccountStub,
        validationStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if password confirmation fails', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password: 'pwd',
                password_confirmation: 'pwd_invalid'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new InvalidParamError('password_confirmation')))
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('password_confirmation'))
    })
    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
    test('Should call emailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        await sut.handle(makeFakeRequest())

        expect(isValidSpy).toHaveBeenCalledWith(makeFakeRequest().body.email)
    })
    test('Should return 500 if email validator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password: 'pwd',
                password_confirmation: 'pwd'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })
    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()

        const addSpy = jest.spyOn(addAccountStub, 'add')

        await sut.handle(makeFakeRequest())

        expect(addSpy).toHaveBeenCalledWith({
            name: 'name',
            email: 'any_email@mail.com',
            password: 'pwd'
        })
    })
    test('Should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()

        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password: 'pwd',
                password_confirmation: 'pwd'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse).toEqual(serverError(new ServerError(null)))
    })

    test('Should return 200 if AddAccount succeeds', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test('Should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut()

        const validateSpy = jest.spyOn(validationStub, 'validate')
        await sut.handle(makeFakeRequest())

        expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
    })

    test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()

        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })
})
