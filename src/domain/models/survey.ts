export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

export type SurveyAnswerModel = {
  answer: string
  image?: string
}
