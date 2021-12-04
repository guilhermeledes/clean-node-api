import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSuveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSuveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSuveyResultRepository.save(data)
    const surveyResult = await this.loadSuveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
    return surveyResult
  }
}
