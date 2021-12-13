import { SurveyModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'
import app from '@/main/config/app'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { mockAccessToken } from '@/tests/main/mocks'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return MongoHelper.map(await surveyCollection.findOne({ _id: res.insertedId }))
}

describe('Survey Routes', () => {
  beforeAll(async () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without valid accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 on save survey result with valid accessToken', async () => {
      const survey = await makeSurvey()
      const accessToken = await mockAccessToken(accountCollection)
      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set({ 'x-access-token': accessToken })
        .send({
          answer: survey.answers[0].answer
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without valid accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 200 on load survey result with valid accessToken', async () => {
      const survey = await makeSurvey()
      const accessToken = await mockAccessToken(accountCollection)
      await request(app)
        .get(`/api/surveys/${survey.id}/results`)
        .set({ 'x-access-token': accessToken })
        .expect(200)
    })
  })
})
