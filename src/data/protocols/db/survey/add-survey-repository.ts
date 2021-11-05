import { AddSurveyModel } from '../../../../domain/usecases/add-survey'

export interface AddSuveyRepository {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
