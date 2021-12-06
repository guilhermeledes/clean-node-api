import { LoadAnswersBySurveyRepository } from "../protocols";
import { LoadAnswersBySurvey } from '@/domain/usecases';

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (
    private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository
  ) {}

  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurvey.Result> {
    return this.loadAnswersBySurveyRepository.loadAnswers(surveyId)
  }
}
