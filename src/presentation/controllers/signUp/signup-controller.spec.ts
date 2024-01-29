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

interface ISutTypes {
    sut: SignUpController
    addAccountStub: IAddAccount
    validationStub: IValidation
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
    const validationStub = makeValidation()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(addAccountStub, validationStub)

    return {
        sut,
        addAccountStub,
        validationStub
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
