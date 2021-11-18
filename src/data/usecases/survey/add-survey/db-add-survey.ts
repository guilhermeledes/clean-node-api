import { AddSurvey, AddSurveyParams, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSuveyRepository: AddSurveyRepository
  ) {}

  async add (data: AddSurveyParams): Promise<void> {
    await this.addSuveyRepository.add(data)
  }
}
