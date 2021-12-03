import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'
import { AddSurveyRepositorySpy } from '@/data/test'
import { mockAddSurveyParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddSurvey
  addSuveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSuveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSuveyRepositorySpy)
  return {
    sut,
    addSuveyRepositorySpy
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSuveyRepositorySpy } = makeSut()
    const surveyData = mockAddSurveyParams()
    await sut.add(surveyData)
    expect(addSuveyRepositorySpy.addSurveyParams).toBe(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSuveyRepositorySpy } = makeSut()
    jest.spyOn(addSuveyRepositorySpy, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
