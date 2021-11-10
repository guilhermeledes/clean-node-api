import { AddSurveyModel } from '@/domain/usecases/survey-result/save-survey-result'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
