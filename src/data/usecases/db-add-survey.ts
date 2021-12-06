import { AddSurveyRepository } from '@/data/protocols'
import { AddSurvey } from '@/domain/usecases'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSuveyRepository: AddSurveyRepository
  ) {}

  async add (data: AddSurvey.Params): Promise<void> {
    await this.addSuveyRepository.add(data)
  }
}
