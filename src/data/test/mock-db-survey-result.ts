import { mockSurveyResultModel } from '@/domain/test'
import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { LoadSurveyResultRepository } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams: SaveSurveyResultParams

  async save (data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId: string
  surveyResultModel: SurveyResultModel = mockSurveyResultModel()

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return Promise.resolve(this.surveyResultModel)
  }
}
