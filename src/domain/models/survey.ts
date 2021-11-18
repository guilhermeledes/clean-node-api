export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
  didAnswer?: boolean
}

export type SurveyAnswerModel = {
  answer: string
  image?: string
}
