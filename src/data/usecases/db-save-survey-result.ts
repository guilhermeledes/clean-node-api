import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { SaveSurveyResult } from '@/domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSuveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSuveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSuveyResultRepository.save(data)
    const surveyResult = await this.loadSuveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
    return surveyResult
  }
}
