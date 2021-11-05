import { AddSurvey, AddSurveyModel, AddSuveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSuveyRepository: AddSuveyRepository
  ) {}

  async add (data: AddSurveyModel): Promise<void> {
    await this.addSuveyRepository.add(data)
  }
}
