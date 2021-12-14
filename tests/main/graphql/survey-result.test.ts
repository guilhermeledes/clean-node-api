import { SurveyModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { mockAccessToken } from '@/tests/main/mocks'
import { Express } from 'express'
import { Collection } from 'mongodb'
import request from 'supertest'

let app: Express
let surveyCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return MongoHelper.map(await surveyCollection.findOne({ _id: res.insertedId }))
}

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const query = (surveyId: string): string => `
      query {
        surveyResult (surveyId: "${surveyId}") {
          question
          answers {
            image
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('Should return SurveyResult on success', async () => {
      const survey = await makeSurvey()
      const accessToken = await mockAccessToken(accountCollection)
      const res = await request(app)
        .post('/graphql')
        .set({ 'x-access-token': accessToken })
        .send({ query: query(survey.id.toString()) })
      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe(survey.question)
      expect(res.body.data.surveyResult.date).toBe(survey.date.toISOString())
      expect(res.body.data.surveyResult.answers).toEqual([
        ...survey.answers.map(answer => ({
          answer: answer.answer,
          image: answer.image,
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }))
      ])
    })

    test('Should return AccessDeniedError if no valid token is provided', async () => {
      const survey = await makeSurvey()
      const res = await request(app)
        .post('/graphql')
        .send({ query: query(survey.id.toString()) })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const mutation = (surveyId: string, answer: string): string => `
      mutation {
        saveSurveyResult (surveyId: "${surveyId}", answer: "${answer}") {
          question
          answers {
            image
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('Should return SurveyResult on success', async () => {
      const survey = await makeSurvey()
      const accessToken = await mockAccessToken(accountCollection)
      const res = await request(app)
        .post('/graphql')
        .set({ 'x-access-token': accessToken })
        .send({ query: mutation(survey.id.toString(), survey.answers[0].answer) })
      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.question).toBe(survey.question)
      expect(res.body.data.saveSurveyResult.date).toBe(survey.date.toISOString())
      expect(res.body.data.saveSurveyResult.answers).toEqual(expect.arrayContaining([
        ...survey.answers.map((answer, index) => ({
          answer: answer.answer,
          image: answer.image,
          count: index === 0 ? 1 : 0,
          percent: index === 0 ? 100 : 0,
          isCurrentAccountAnswer: index === 0
        }))
      ]))
    })

    test('Should return AccessDeniedError if no valid token is provided', async () => {
      const survey = await makeSurvey()
      const res = await request(app)
        .post('/graphql')
        .send({ query: mutation(survey.id.toString(), survey.answers[0].answer) })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})
