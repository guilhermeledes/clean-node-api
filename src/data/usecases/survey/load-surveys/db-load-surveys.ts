import { SurveyModel, LoadSurveys, LoadSurveysRepository } from './db-load-surveys-protocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll()
  }
}
