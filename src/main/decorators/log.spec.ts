import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface ISutTypes {
    sut: LogControllerDecorator
    controllerStub: IController
}

const makeSut = (): ISutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)
    return { sut, controllerStub }
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
})
