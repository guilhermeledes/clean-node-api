import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helper/http-helper'
import { HttpRequest } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean { return true }
  }
  return new EmailValidatorStub()
}

const makeFakeHttpRequest = (): HttpRequest => (
  {
    body: {
      email: 'any_mail@mail.com',
      password: 'any_password'
    }
  })

describe('Login Controller', () => {
  test('Shoul return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Shoul return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
