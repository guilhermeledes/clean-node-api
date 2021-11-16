import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import MockDate from 'mockdate'
import { mockAccountModel, mockSaveSurveyResultParams, mockSurveyModel } from '@/domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

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
    test('Should add a surveyResult on success if its new', async () => {
      const survey = await mockSurveyModel()
      const account = await mockAccountModel()
      const sut = makeSut()
      const surveyResult = await sut.save(mockSaveSurveyResultParams(survey, account))
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.accountId).toEqual(account.id)
      expect(surveyResult.answer).toEqual(survey.answers[0].answer)
      expect(surveyResult.date).toEqual(new Date())
    })

    test('Should update a surveyResult on success if its not new', async () => {
      const survey = await mockSurveyModel()
      const account = await mockAccountModel()
      const res = await surveyResultCollection.insertOne(mockSaveSurveyResultParams(survey, account))
      const newAnswer = survey.answers[1].answer
      const sut = makeSut()
      const surveyResult = await sut.save({ ...mockSaveSurveyResultParams(survey, account), answer: newAnswer })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(res.ops[0]._id)
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.accountId).toEqual(account.id)
      expect(surveyResult.answer).toEqual(newAnswer)
      expect(surveyResult.date).toEqual(new Date())
    })
  })
})
