import request from 'supertest'
import app from '@/main/config/app'
import { Collection } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AccountModel } from '@/domain/models/account'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const survey = {
    question: 'any_question',
    answers: [
      { answer: 'any_answer', image: 'any_image' },
      { answer: 'other_answer', image: 'other_image' }
    ],
    date: new Date()
  }
  const res = await surveyCollection.insertOne(survey)
  return { ...survey, id: res.ops[0]._id }
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
  return { ...res.ops[0], id: res.ops[0]._id }
}

const makeAccessToken = async (): Promise<string> => {
  const account = await makeAccount()
  const accessToken = sign({ id: account.id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: account.id
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without valid accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 on save survey result with valid accessToken', async () => {
      const survey = await makeSurvey()
      const accessToken = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set({ 'x-access-token': accessToken })
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
})
