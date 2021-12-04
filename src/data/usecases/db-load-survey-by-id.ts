import { LoadSurveyByIdRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyById } from '@/domain/usecases'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById (surveyId: string): Promise<SurveyModel> {
    return await this.loadSurveyByIdRepository.loadById(surveyId)
  }
}
