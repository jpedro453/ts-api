import { SignUpController } from './signup-controller'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import {
    IEmailValidator,
    IAddAccountModel,
    IAddAccount,
    IAccountModel,
    IHttpRequest,
    IValidation
} from './signup-controller-protocols'
import { ok, serverError, badRequest } from '../../helpers/http/http-helper'
import { IAuthentication, IAuthenticationModel } from '../../../domain/useCases/authentication'

interface ISutTypes {
    sut: SignUpController
    addAccountStub: IAddAccount
    authenticationStub: IAuthentication
    validationStub: IValidation
}

const makeAuthentication = (): IAuthentication => {
    class AuthenticationStub implements IAuthentication {
        async auth(authentication: IAuthenticationModel): Promise<string> {
            return 'any_token'
        }
    }
    return new AuthenticationStub()
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
            return null as any
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
    const validationStub = makeValidation()
    const addAccountStub = makeAddAccount()
    const authenticationStub = makeAuthentication()
    const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
    }
}

describe('SignUp Controller', () => {
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
        expect(httpResponse).toEqual(serverError(new ServerError(null as any)))
    })

    test('Should return 200 if AddAccount succeeds', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
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

    test('Should call authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()

        const authSpy = jest.spyOn(authenticationStub, 'auth')

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'pwd' })
    })

    test('Should return 500 if authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
