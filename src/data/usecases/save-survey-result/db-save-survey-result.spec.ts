import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultModel, SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { SurveyResultModel } from '@/domain/models/survey-result'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSuveyRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSuveyRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSuveyRepositoryStub)
  return {
    sut,
    saveSuveyRepositoryStub
  }
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResult())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeFakeSaveSurveyResult = (): SaveSurveyResultModel => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answers: 'any_answer',
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({ ...makeFakeSaveSurveyResult(), id: 'any_id' })

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSuveyRepositoryStub } = makeSut()
    const surveyData = makeFakeSaveSurveyResult()
    const saveSpy = jest.spyOn(saveSuveyRepositoryStub, 'save')
    await sut.save(surveyData)
    expect(saveSpy).toHaveBeenCalledWith(surveyData)
  })
})
