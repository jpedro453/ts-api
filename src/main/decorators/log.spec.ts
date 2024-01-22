import { ILogErrorRepository } from '../../data/protocols/log-error-repository '
import { IAccountModel } from '../../domain/models/account'
import { serverError, ok } from '../../presentation/helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeFakeRequest = (): IHttpRequest => ({
    body: {
        name: 'name',
        email: 'any_email@mail.com',
        password: 'pwd',
        password_confirmation: 'pwd'
    }
})
const makeFakeAccount = (): IAccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeFakeServerError = (): IHttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)
}

interface ISutTypes {
    sut: LogControllerDecorator
    controllerStub: IController
    logErrorRepositoryStub: ILogErrorRepository
}

const makeSut = (): ISutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return { sut, controllerStub, logErrorRepositoryStub }
}

const makeLogErrorRepository = (): ILogErrorRepository => {
    class LogErrorRepositoryStub implements ILogErrorRepository {
        async log(stack: string): Promise<void> {
            return new Promise((resolve) => resolve())
        }
    }
    return new LogErrorRepositoryStub()
}

const makeController = (): IController => {
    class ControllerStub implements IController {
        handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
            return new Promise((resolve) => resolve(ok(makeFakeAccount())))
        }
    }
    return new ControllerStub()
}

describe('LogController decorator', () => {
    test('should call controller handle ', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')

        await sut.handle(makeFakeRequest())
        expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
    })

    test('should return the same result of the controller ', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test('should call LogErrorRepository with correct error if controller returns serverError ', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
            new Promise((resolve) => resolve(makeFakeServerError()))
        )
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
