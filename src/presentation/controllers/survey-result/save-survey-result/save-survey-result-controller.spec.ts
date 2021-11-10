import { HttpRequest, LoadSurveyById, SurveyModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyById: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyById)
  return {
    sut,
    loadSurveyById
  }
}

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
  }
})

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should : ensure SaveSurveyResultController call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyById } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyById,'loadById')
    await sut.handle(makeFakeHttpRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
