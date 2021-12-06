import { AddSurvey, CheckSurveyById, LoadAnswersBySurvey, LoadSurveys } from '@/domain/usecases'
import { mockSurveyModels } from '@/tests/domain/mocks'
import faker from 'faker'

export class AddSurveySpy implements AddSurvey {
  data: AddSurvey.Params
  async add (data: AddSurvey.Params): Promise<void> {
    this.data = data
    return await Promise.resolve()
  }
}
export class LoadSurveysSpy implements LoadSurveys {
  accountId: string
  result = mockSurveyModels()
  async load (accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }
}
export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  surveyId: string
  result = [faker.random.word(), faker.random.word()]

  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurvey.Result> {
    this.surveyId = surveyId
    return Promise.resolve(this.result)
  }
}
export class CheckSurveyByIdSpy implements CheckSurveyById {
  surveyId: string
  result = true
  async checkById (surveyId: string): Promise<CheckSurveyById.Result> {
    this.surveyId = surveyId
    return Promise.resolve(this.result)
  }
}
