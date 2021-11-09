import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeFakeSurvey = (prefix: string = 'any'): any => ({
  question: `${prefix}_question`,
  answers: [
    { answer: `${prefix}_answer`, image: `${prefix}_image` }
  ],
  date: new Date()
})

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Ledes',
    email: 'ledes@gmail.com',
    password: '123',
    role: 'admin'
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: { accessToken }
  })
  return accessToken
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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [
            { answer: 'any_answer', image: 'http://image-name.com' },
            { answer: 'other_answer' }
          ]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set({ 'x-access-token': accessToken })
        .send({
          question: 'any_question',
          answers: [
            { answer: 'any_answer', image: 'http://image-name.com' },
            { answer: 'other_answer' }
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
      const accessToken = await makeAccessToken()
      await surveyCollection.insertMany([makeFakeSurvey(), makeFakeSurvey('other')])
      await request(app)
        .get('/api/surveys')
        .set({ 'x-access-token': accessToken })
        .expect(200)
    })
  })
})
