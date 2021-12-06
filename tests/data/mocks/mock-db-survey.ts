import { AddSurveyRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols';
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks';
import faker from 'faker';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  params: AddSurveyRepository.Params

  async add (data: AddSurveyRepository.Params): Promise<void> {
    this.params = data
    return await Promise.resolve()
  }
}
export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyId: string
  result: LoadSurveyByIdRepository.Result = mockSurveyModel()

  async loadById (surveyId: string): Promise<LoadSurveyByIdRepository.Result> {
    this.surveyId = surveyId
    return await Promise.resolve(this.result)
  }
}
export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  surveyId: string
  result: LoadAnswersBySurveyRepository.Result = [faker.random.word(), faker.random.word()]

  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.surveyId = surveyId
    return await Promise.resolve(this.result)
  }
}
export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  surveyId: string
  result: CheckSurveyByIdRepository.Result = true

  async checkById (surveyId: string): Promise<CheckSurveyByIdRepository.Result> {
    this.surveyId = surveyId
    return await Promise.resolve(this.result)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  result: LoadSurveysRepository.Result = mockSurveyModels()
  accountId: string

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }
}
