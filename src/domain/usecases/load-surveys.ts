import { SurveyModel } from '@/domain/models/survey'

export type LoadSurveys = {
  load: () => Promise<SurveyModel[]>
}
