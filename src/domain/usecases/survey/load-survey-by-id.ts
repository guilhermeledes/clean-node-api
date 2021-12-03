import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyById {
  loadById: (surveyId: string) => Promise<SurveyModel>
}
