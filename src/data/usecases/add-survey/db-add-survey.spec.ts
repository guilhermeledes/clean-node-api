import { AddSurveyParams, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSuveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSuveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSuveyRepositoryStub)
  return {
    sut,
    addSuveyRepositoryStub
  }
}

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' }
  ],
  date: new Date()
})

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSuveyRepositoryStub } = makeSut()
    const surveyData = makeFakeSurveyData()
    const addSpy = jest.spyOn(addSuveyRepositoryStub, 'add')
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSuveyRepositoryStub } = makeSut()
    jest.spyOn(addSuveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
