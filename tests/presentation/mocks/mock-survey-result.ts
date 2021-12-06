import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params: SaveSurveyResult.Params
  result: SaveSurveyResult.Result = mockSurveyResultModel()

  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.params = data
    return await Promise.resolve(this.result)
  }
}
export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  accountId: string
  result: LoadSurveyResult.Result = mockSurveyResultModel()

  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}
