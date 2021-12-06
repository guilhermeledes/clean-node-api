export interface LoadAnswersBySurveyRepository {
  loadAnswers: (surveyId: string) => Promise<LoadAnswersBySurveyRepository.Result>
}
export namespace LoadAnswersBySurveyRepository {
  export type Result = string[]
}
