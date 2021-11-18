import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, LoadSurveyResultRepository } from './db-save-survey-result-protocols'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSuveyResultRepositoryStub: SaveSurveyResultRepository
  loadSuveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSuveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSuveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSuveyResultRepositoryStub, loadSuveyResultRepositoryStub)
  return {
    sut,
    saveSuveyResultRepositoryStub,
    loadSuveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSuveyResultRepositoryStub } = makeSut()
    const surveyData = mockSaveSurveyResultParams()
    const loadBySurveyIdSpy = jest.spyOn(loadSuveyResultRepositoryStub, 'loadBySurveyId')
    await sut.save(surveyData)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyData.surveyId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSuveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSuveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSuveyResultRepositoryStub } = makeSut()
    const surveyData = mockSaveSurveyResultParams()
    const saveSpy = jest.spyOn(saveSuveyResultRepositoryStub, 'save')
    await sut.save(surveyData)
    expect(saveSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSuveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSuveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    await expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
