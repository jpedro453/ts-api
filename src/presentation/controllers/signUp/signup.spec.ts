import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { IEmailValidator, IAddAccountModel, IAddAccount, IAccountModel } from './signup-protocols'
import { serverError } from '../../helpers/http-helper'
interface ISutTypes {
    sut: SignUpController
    emailValidatorStub: IEmailValidator
    addAccountStub: IAddAccount
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
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password'
            }
            return new Promise((resolve) => resolve(fakeAccount))
        }
    }
    return new AddAccountStub()
}

const makeSut = (): ISutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)

    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'pwd',
                password_confirmation: 'pwd'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'name',
                password: 'pwd',
                password_confirmation: 'pwd'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })
    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password_confirmation: 'pwd'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })
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

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('password_confirmation'))
    })
    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password: 'pwd',
                password_confirmation: 'pwd'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
    test('Should call emailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password: 'pwd',
                password_confirmation: 'pwd'
            }
        }
        await sut.handle(httpRequest)

        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
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
        expect(httpResponse).toEqual(serverError(new Error()))
    })
    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()

        const addSpy = jest.spyOn(addAccountStub, 'add')

        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password: 'pwd',
                password_confirmation: 'pwd'
            }
        }

        await sut.handle(httpRequest)

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
        expect(httpResponse).toEqual(serverError(new Error()))
    })
    test('Should return 200 if AddAccount succeeds', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_pwd',
                password_confirmation: 'valid_pwd'
            }
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toStrictEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        })
    })
})
