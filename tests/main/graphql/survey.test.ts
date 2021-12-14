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

describe('Survey GraphQL', () => {
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

  describe('Surveys Query', () => {
    const query = `
      query {
        surveys {
          id
          question
          answers {
            answer
            image
          }
          date
          didAnswer
        }
      }
    `

    test('Should return Surveys', async () => {
      const survey = await makeSurvey()
      const accessToken = await mockAccessToken(accountCollection)
      const res = await request(app)
        .post('/graphql')
        .set({ 'x-access-token': accessToken })
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe(survey.question)
      expect(res.body.data.surveys[0].date).toBe(survey.date.toISOString())
      expect(res.body.data.surveys[0].didAnswer).toBe(false)
      expect(res.body.data.surveys[0].answers).toEqual(survey.answers)
    })

    test('Should return AccessDeniedError if no valid token is provided', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})
