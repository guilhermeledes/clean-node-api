import { SurveyModel } from '@/domain/models'

export interface LoadSurveyByIdRepository {
  loadById: (surveyId: string) => Promise<LoadSurveyByIdRepository.Result>
}
export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel
}
