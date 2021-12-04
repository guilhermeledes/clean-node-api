import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import faker from 'faker'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: faker.random.word(),
  date: faker.date.recent()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.word(),
    count: faker.datatype.number({ min: 0, max: 1000 }),
    percent: faker.datatype.number({ min: 0, max: 100, precision: 2 }),
    isCurrentAccountAnswer: faker.datatype.boolean()
  },{
    image: faker.image.imageUrl(),
    answer: faker.random.word(),
    count: faker.datatype.number({ min: 0, max: 1000 }),
    percent: faker.datatype.number({ min: 0, max: 100, precision: 2 }),
    isCurrentAccountAnswer: faker.datatype.boolean()
  }],
  date: faker.date.recent()
})
