import { SurveyAnswerModel, SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import faker from 'faker'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.random.words(),
  answers: [
    mockSurveyAnswerModel(),
    mockSurveyAnswerModel(),
    mockSurveyAnswerModel()
  ],
  date: faker.date.recent()
})

export const mockSurveyModels = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]

export const mockSurveyModel = (): SurveyModel => (
  {
    id: faker.datatype.uuid(),
    question: faker.random.words(),
    answers: [
      mockSurveyAnswerModel(),
      mockSurveyAnswerModel()
    ],
    date: faker.date.recent()
  })

export const mockSurveyAnswerModel = (): SurveyAnswerModel => ({
  answer: faker.random.word(),
  image: faker.image.imageUrl()
})
