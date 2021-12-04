import { SurveyModel } from '@/domain/models'

export interface LoadSurveyById {
  loadById: (surveyId: string) => Promise<SurveyModel>
}
