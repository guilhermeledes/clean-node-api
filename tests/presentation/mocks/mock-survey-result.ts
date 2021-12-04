import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  data: SaveSurveyResultParams
  surveyResultModel: SurveyResultModel = mockSurveyResultModel()

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.data = data
    return await Promise.resolve(this.surveyResultModel)
  }
}
export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  accountId: string
  surveyResultModel: SurveyResultModel = mockSurveyResultModel()

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.surveyResultModel)
  }
}
