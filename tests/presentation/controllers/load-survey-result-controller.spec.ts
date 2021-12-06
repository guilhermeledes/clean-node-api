import { LoadSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helper'
import { CheckSurveyByIdSpy, LoadSurveyResultSpy } from '@/tests/presentation/mocks'
import faker from 'faker'
import MockDate from 'mockdate'

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdSpy: CheckSurveyByIdSpy
  loadSurveyresultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy()
  const loadSurveyresultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyresultSpy)
  return {
    sut,
    checkSurveyByIdSpy,
    loadSurveyresultSpy
  }
}

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid()
})

describe('LoadSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call CheckSurveyById with correct values', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(checkSurveyByIdSpy.surveyId).toBe(request.surveyId)
  })

  test('Should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    checkSurveyByIdSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyresultSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveyresultSpy.surveyId).toBe(request.surveyId)
    expect(loadSurveyresultSpy.accountId).toBe(request.accountId)
  })

  test('Should return 200 with correct data on success', async () => {
    const { sut, loadSurveyresultSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveyresultSpy.result))
  })
})
