import { MissingParamError } from '../errors/missing-param-erros'
import { SignUpController } from './signup'

describe('SignUp', () => {
  test('shouldreturn 400 if no name is privided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'test@example.com',
        password: 'test',
        password_confirmation: 'test'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
})

describe('SignUp', () => {
  test('shouldreturn 400 if no name is privided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'test',
        password: 'test',
        password_confirmation: 'test'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})

describe('SignUp', () => {
  test('shouldreturn 400 if no name is privided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'test',
        email: 'test@example.com',
        password_confirmation: 'test'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
})
