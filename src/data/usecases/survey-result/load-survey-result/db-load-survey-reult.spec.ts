import { LoadSurveyResultRepository,LoadSurveyByIdRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-reult'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository with correct value', async () => {
    const { sut,loadSurveyResultRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadSurveyByIdSpy).toBeCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut,loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub,'loadById')
    await sut.load('any_survey_id')
    expect(loadSurveyByIdSpy).toBeCalledWith('any_survey_id')
  })

  test('Should return SurveyResultModel with all answers count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut,loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
