import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepositorySpy } from '@/tests/data/mocks'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

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
    expect(addSuveyRepositorySpy.params).toBe(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSuveyRepositorySpy } = makeSut()
    jest.spyOn(addSuveyRepositorySpy, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
