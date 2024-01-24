import { LoginController } from './login'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { IHttpRequest, IAuthentication } from './login-protocols'
import { IValidation } from '../signUp/signup-protocols'

const makeAuthentication = (): IAuthentication => {
    class AuthenticationStub implements IAuthentication {
        async auth(email: string, password: string): Promise<string> {
            return 'any_token'
        }
    }
    return new AuthenticationStub()
}

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

const makeFakeRequest = (): IHttpRequest => ({
    body: {
        email: 'any_email@email.com',
        password: 'any_password'
    }
})

interface ISutTypes {
    sut: LoginController
    authenticationStub: IAuthentication
    validationStub: IValidation
}

const makeSut = (): ISutTypes => {
    const authenticationStub = makeAuthentication()
    const validationStub = makeValidation()
    const sut = new LoginController(authenticationStub, validationStub)
    return { sut, authenticationStub, validationStub }
}

describe('Login Controller', () => {
    test('Should call authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()

        const authSpy = jest.spyOn(authenticationStub, 'auth')

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(authSpy).toHaveBeenCalledWith('any_email@email.com', 'any_password')
    })
    test('Should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)))

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(unauthorized())
    })
    test('Should return 500 if authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const httpResponse = await sut.handle(makeFakeRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })
    test('Should return 200 if valid credentials', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
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
})
