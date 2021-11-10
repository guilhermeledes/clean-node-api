import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      { answer: 'any_answer', image: 'any_image' },
      { answer: 'other_answer' }
    ],
    date: new Date()
  })
  return { ...res.ops[0], id: res.ops[0]._id }
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  })
  return { ...res.ops[0], id: res.ops[0]._id }
}

const makeSaveSurveyResultModel = (survey: SurveyModel, account: AccountModel): SaveSurveyResultModel => ({
  surveyId: survey.id,
  accountId: account.id,
  answer: survey.answers[0].answer,
  date: new Date()
})

describe('SurveyResultMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey on success if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResult = await sut.save(makeSaveSurveyResultModel(survey, account))
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.accountId).toEqual(account.id)
      expect(surveyResult.answer).toEqual(survey.answers[0].answer)
      expect(surveyResult.date).toEqual(new Date())
    })
  })
})
