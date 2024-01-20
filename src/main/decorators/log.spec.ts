import { ILogErrorRepository } from '../../data/protocols/log-error-repository '
import { serverError } from '../../presentation/helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

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
            const httpResponse: IHttpResponse = {
                statusCode: 200,
                body: {
                    name: 'Joao'
                }
            }

            return new Promise((resolve) => resolve(httpResponse))
        }
    }
    return new ControllerStub()
}

describe('LogController decorator', () => {
    test('should call controller handle ', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = {
            body: {
                name: 'any_mail@gmail.com',
                email: 'any_name',
                password: 'any_password',
                confirm_password: 'any_password'
            }
        }
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('should return the same result of the controller ', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_mail@gmail.com',
                email: 'any_name',
                password: 'any_password',
                confirm_password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'Joao'
            }
        })
    })

    test('should call LogErrorRepository with correct error if controller returns serverError ', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(error)))
        const httpRequest = {
            body: {
                name: 'any_mail@gmail.com',
                email: 'any_name',
                password: 'any_password',
                confirm_password: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
