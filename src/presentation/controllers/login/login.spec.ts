import { MissingParamError } from '../../errors'
import { badRequest } from '../../helper/http-helper'
import { HttpRequest } from '../../protocols'
import { LoginController } from './login'

const makeSut = (): LoginController => {
  return new LoginController()
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
    const sut = makeSut()
    const httpRequest = makeFakeHttpRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
