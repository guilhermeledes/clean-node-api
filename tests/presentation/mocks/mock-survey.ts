import { SurveyModel } from '@/domain/models/survey'
import { AddSurvey, AddSurveyParams, LoadSurveyById, LoadSurveys } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  data: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
    this.data = data
    return await Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  accountId: string
  surveyModels = mockSurveyModels()

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return await Promise.resolve(this.surveyModels)
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyId: string
  surveyModel = mockSurveyModel()

  async loadById (surveyId: string): Promise<SurveyModel> {
    this.surveyId = surveyId
    return Promise.resolve(this.surveyModel)
  }
}
