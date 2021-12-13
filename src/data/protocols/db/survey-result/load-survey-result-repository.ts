import { LoadSurveyResult } from '@/domain/usecases'

export interface LoadSurveyResultRepository {
  loadBySurveyId: (surveyId: string, accountId: string) => Promise<LoadSurveyResultRepository.Result>
}
export namespace LoadSurveyResultRepository {
  export type Result = LoadSurveyResult.Result
}
