import { HttpRequest } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, ok, serverError } from '@/presentation/helper/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'
import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from '@/presentation/test'
import faker from 'faker'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy

}

const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultSpy)
  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  }
}

const mockRequest = (answer?: string): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid()
  },
  body: {
    answer
  },
  accountId: faker.datatype.uuid()
})

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveyByIdSpy.surveyId).toBe(httpRequest.params.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy,'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    httpRequest.body.answer = 'invalid_answer'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    const httpeRequest = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer)
    await sut.handle(httpeRequest)
    expect(saveSurveyResultSpy.data).toEqual({
      surveyId: httpeRequest.params.surveyId,
      accountId: httpeRequest.accountId,
      answer: httpeRequest.body.answer,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer))
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 with correct data if succeeds', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer))
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel))
  })
})
