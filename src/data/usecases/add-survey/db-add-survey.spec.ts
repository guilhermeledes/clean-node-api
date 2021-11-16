import { AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'
import { mockAddSurveyRepository } from '@/data/test'
import { mockAddSurveyParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddSurvey
  addSuveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSuveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSuveyRepositoryStub)
  return {
    sut,
    addSuveyRepositoryStub
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
    const { sut, addSuveyRepositoryStub } = makeSut()
    const surveyData = mockAddSurveyParams()
    const addSpy = jest.spyOn(addSuveyRepositoryStub, 'add')
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSuveyRepositoryStub } = makeSut()
    jest.spyOn(addSuveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
