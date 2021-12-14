import { MongoHelper } from '@/infra/db'
import { setupApp } from '@/main/config/app'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { mockAccessToken } from '@/tests/main/mocks'
import { Express } from 'express'
import faker from 'faker'
import { Collection } from 'mongodb'
import request from 'supertest'

let app: Express
let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: faker.lorem.words(),
          answers: [
            { answer: faker.random.word(), image: faker.image.imageUrl() },
            { answer: faker.random.word() }
          ]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with accessToken', async () => {
      const accessToken = await mockAccessToken(accountCollection, 'admin')
      await request(app)
        .post('/api/surveys')
        .set({ 'x-access-token': accessToken })
        .send({
          question: faker.lorem.words(),
          answers: [
            { answer: faker.random.word(), image: faker.image.imageUrl() },
            { answer: faker.random.word() }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on load surveys with accessToken', async () => {
      const accessToken = await mockAccessToken(accountCollection, 'admin')
      await surveyCollection.insertMany([mockAddSurveyParams(), mockAddSurveyParams()])
      await request(app)
        .get('/api/surveys')
        .set({ 'x-access-token': accessToken })
        .expect(200)
    })
  })
})
