import { DbSaveSurveyResult } from '@/data/usecases'
import { LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '@/tests/data/mocks'
import { mockSaveSurveyResultParams } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSuveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSuveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSuveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSuveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSuveyResultRepositorySpy, loadSuveyResultRepositorySpy)
  return {
    sut,
    saveSuveyResultRepositorySpy,
    loadSuveyResultRepositorySpy
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
    const { sut, loadSuveyResultRepositorySpy } = makeSut()
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(loadSuveyResultRepositorySpy.surveyId).toBe(surveyData.surveyId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSuveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSuveyResultRepositorySpy, 'loadBySurveyId').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSuveyResultRepositorySpy } = makeSut()
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(saveSuveyResultRepositorySpy.saveSurveyResultParams).toEqual(surveyData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSuveyResultRepositorySpy } = makeSut()
    jest.spyOn(saveSuveyResultRepositorySpy, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey on success', async () => {
    const { sut, loadSuveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    await expect(surveyResult).toEqual(loadSuveyResultRepositorySpy.surveyResultModel)
  })
})
