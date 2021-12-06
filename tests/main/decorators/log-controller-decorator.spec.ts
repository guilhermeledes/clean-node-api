import { LogControllerDecorator } from '@/main/decorators'
import { ok, serverError } from '@/presentation/helper'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { LogErrorRepositorySpy } from '@/tests/data/mocks'
import faker from 'faker'

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return { sut, controllerSpy, logErrorRepositorySpy }
}

class ControllerSpy implements Controller {
  request: any
  httpResponse: HttpResponse = ok(faker.random.word())

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return await Promise.resolve(this.httpResponse)
  }
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = faker.lorem.sentence()
    await sut.handle(request)
    expect(controllerSpy.request).toBe(request)
  })

  test('Should return the same result of the crontroler', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(faker.lorem.sentence())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    jest.spyOn(controllerSpy, 'handle').mockReturnValueOnce(Promise.resolve(mockServerError()))
    const logSpy = jest.spyOn(logErrorRepositorySpy, 'logError')
    await sut.handle(faker.lorem.sentence())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
