import { SaveSurveyResultParams } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import MockDate from 'mockdate'
import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  const survey = await surveyCollection.findOne({ _id: res.ops[0]._id })
  return MongoHelper.map(survey)
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.map(res.ops[0])
}

const mockSaveSurveyResultParams = (survey: SurveyModel, account: AccountModel, answerIndex: number = 0): SaveSurveyResultParams => ({
  surveyId: survey.id,
  accountId: account.id,
  answer: survey.answers[answerIndex].answer,
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
    test('Should add a surveyResult on success if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      await sut.save(mockSaveSurveyResultParams(survey, account))
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update a surveyResult on success if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const saveSurveyResultParams = mockSaveSurveyResultParams(survey, account)
      await surveyResultCollection.insertOne(saveSurveyResultParams)
      const newAnswer = survey.answers[1].answer
      const sut = makeSut()
      await sut.save({
        ...saveSurveyResultParams,
        answer: newAnswer
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answer).toBe(newAnswer)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load surveyResult on success', async () => {
      const survey = await makeSurvey()
      const account1 = await makeAccount()
      const account2 = await makeAccount()
      const account3 = await makeAccount()
      const account4 = await makeAccount()
      await surveyResultCollection.insertMany([
        mockSaveSurveyResultParams(survey, account1, 0),
        mockSaveSurveyResultParams(survey, account2, 1),
        mockSaveSurveyResultParams(survey, account3, 1),
        mockSaveSurveyResultParams(survey, account4, 0)
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account1.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load surveyResult on success', async () => {
      const survey = await makeSurvey()
      const account1 = await makeAccount()
      const account2 = await makeAccount()
      const account3 = await makeAccount()
      const account4 = await makeAccount()
      await surveyResultCollection.insertMany([
        mockSaveSurveyResultParams(survey, account1, 0),
        mockSaveSurveyResultParams(survey, account2, 1),
        mockSaveSurveyResultParams(survey, account3, 1)
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account4.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    test('Should return null if there is no survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id)
      expect(surveyResult).toBeNull()
    })
  })
})
