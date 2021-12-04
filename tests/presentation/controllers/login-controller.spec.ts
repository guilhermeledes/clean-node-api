import { LoginController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helper'
import { AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks'
import faker from 'faker'

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('Login Controller', () => {
  test('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toBe(request)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password
    })
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  test('should return 500 if authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(Error()))
  })
})
