import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController decorator', () => {
    test('should call controller handle ', async () => {
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
        const controllerStub = new ControllerStub()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const sut = new LogControllerDecorator(controllerStub)
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
