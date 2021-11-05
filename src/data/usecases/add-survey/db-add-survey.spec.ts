import { AddSurveyModel, AddSuveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

interface SutTypes {
  sut: DbAddSurvey
  addSuveyRepositoryStub: AddSuveyRepository
}

const makeSut = (): SutTypes => {
  const addSuveyRepositoryStub = makeAddSuveyRepositoryStub()
  const sut = new DbAddSurvey(addSuveyRepositoryStub)
  return {
    sut,
    addSuveyRepositoryStub
  }
}

const makeAddSuveyRepositoryStub = (): AddSuveyRepository => {
  class AddSuveyRepositoryStub implements AddSuveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSuveyRepositoryStub()
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' }
  ]
})

describe('DbAddSurvey Usecase', () => {
  test('Should call AddSuveyRepository with correct values', async () => {
    const { sut, addSuveyRepositoryStub } = makeSut()
    const surveyData = makeFakeSurveyData()
    const addSpy = jest.spyOn(addSuveyRepositoryStub, 'add')
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
