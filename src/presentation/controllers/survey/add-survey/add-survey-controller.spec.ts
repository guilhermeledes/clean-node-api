import { HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helper/http/http-helper'
import MockDate from 'mockdate'
import { AddSurveySpy, ValidationSpy } from '@/presentation/test'
import faker from 'faker'

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

const mockRequest = (): HttpRequest => ({
  body: {
    question: faker.random.words(),
    answers: [{
      answer: faker.random.words(),
      image: faker.image.imageUrl()
    }],
    date: new Date()
  }
})

describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addSurveySpy.data).toEqual(httpRequest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
