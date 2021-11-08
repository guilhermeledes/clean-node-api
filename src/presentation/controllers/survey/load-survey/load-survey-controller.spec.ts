import { LoadSurveysController } from './load-survey-controller'
import { LoadSurveys, SurveyModel } from './load-survey-controller-protocols'
import MockDate from 'mockdate'
import { noContent, ok, serverError } from '../../../helper/http/http-helper'

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveysStub()
}

const makeFakeSurveys = (): SurveyModel[] => [
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      { answer: 'any_answer', image: 'any_image' },
      { answer: 'other_answer' }
    ],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [
      { answer: 'other_any_answer', image: 'other_image' },
      { answer: 'another_answer' }
    ],
    date: new Date()
  }
]

describe('LoadSurveysController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
