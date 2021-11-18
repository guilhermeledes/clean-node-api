import { AddSurveyParams } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { SurveyAnswerModel, SurveyModel } from '@/domain/models/survey'

export const mockAddSurveyParams = (prefix: string = 'any'): AddSurveyParams => ({
  question: `${prefix}_question`,
  answers: [
    mockSurveyAnswerModel(prefix),
    mockSurveyAnswerModel(`other_${prefix}`)
  ],
  date: new Date()
})

export const mockSurveyModels = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel('other')
]

export const mockSurveyModel = (prefix: string = 'any'): SurveyModel => (
  {
    id: `${prefix}_id`,
    question: `${prefix}_question`,
    answers: [
      mockSurveyAnswerModel(prefix),
      mockSurveyAnswerModel(`${prefix}_other`)
    ],
    date: new Date()
  })

export const mockSurveyAnswerModel = (prefix: string = 'any'): SurveyAnswerModel => ({
  answer: `${prefix}_answer`, image: `${prefix}_image`
})
