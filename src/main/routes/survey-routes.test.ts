import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { mockAddSurveyParams } from '@/domain/test'
import { mockAccessToken } from '../test'
import faker from 'faker'

let surveyCollection: Collection
let accountCollection: Collection

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
