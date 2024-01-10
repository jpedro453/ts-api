import { SignUpController } from './signup';
import { MissingParamError } from '../errors/missing-param-error';

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'pwd',
                password_confirmation: 'pwd',
            },
        };

        const httpResponse = sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });

    test('Should return 400 if no email is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'name',
                password: 'pwd',
                password_confirmation: 'pwd',
            },
        };
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });
    test('Should return 400 if no password is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password_confirmation: 'pwd',
            },
        };
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });
    test('Should return 400 if no password is provided', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'name',
                email: 'any_email@mail.com',
                password: 'pwd',
            },
        };
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(
            new MissingParamError('password_confirmation')
        );
    });
});
