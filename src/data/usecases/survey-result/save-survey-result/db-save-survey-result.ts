import { SaveSurveyResult, SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel, LoadSurveyResultRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSuveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSuveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSuveyResultRepository.save(data)
    const surveyResult = await this.loadSuveyResultRepository.loadBySurveyId(data.surveyId)
    return surveyResult
  }
}
