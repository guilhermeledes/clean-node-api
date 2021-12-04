import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

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
