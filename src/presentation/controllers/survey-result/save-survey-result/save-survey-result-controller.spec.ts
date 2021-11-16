import { HttpRequest, LoadSurveyById, SurveyModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { forbidden, ok, serverError } from '@/presentation/helper/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyById: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult

}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = SaveSurveyResultStub()
  const loadSurveyById = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyById, saveSurveyResultStub)
  return {
    sut,
    loadSurveyById,
    saveSurveyResultStub
  }
}

const SaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResultModel())
    }
  }
  return new SaveSurveyResultStub()
}

const makeFakeSurveyResultModel = (): SurveyResultModel => ({
  id: 'valid_id',
  accountId: 'valid_account_id',
  answer: 'valid_answer',
  date: new Date(),
  surveyId: 'valid_survey_id'
})
const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}

const makeFakeSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      { answer: 'any_answer', image: 'any_image' },
      { answer: 'other_answer', image: 'other_image' }
    ],
    date: new Date()
  })

const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyById } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyById,'loadById')
    await sut.handle(makeFakeHttpRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyById } = makeSut()
    jest.spyOn(loadSurveyById,'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyById } = makeSut()
    jest.spyOn(loadSurveyById, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    httpRequest.body.answer = 'invalid_answer'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const httpeRequest = makeFakeHttpRequest()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(httpeRequest)
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: httpeRequest.params.surveyId,
      accountId: httpeRequest.accountId,
      answer: httpeRequest.body.answer,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 with correct data if succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveyResultModel()))
  })
})
