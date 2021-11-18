import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'
import { mockAddAccountParams, mockAddSurveyParams, mockSaveSurveyResultParams } from '@/domain/test'
import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.map(res.ops[0])
}

const mockSurvey = async (prefix: string = 'any'): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams(prefix))
  const survey = await surveyCollection.findOne({ _id: res.ops[0]._id })
  return MongoHelper.map(survey)
}

describe('SurveyMongoRepository', () => {
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

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const survey = await mockSurvey()
      await mockSurvey('other')
      const account = await mockAccount()
      await surveyResultCollection.insertOne(mockSaveSurveyResultParams(survey, account))
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toEqual('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toEqual('other_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should return an empty list if there are no surveys', async () => {
      const account = await mockAccount()
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)
      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const id = res.ops[0]._id
      const fakeSurvey = { ...mockAddSurveyParams(), id }
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey.id).toEqual(id)
      expect(survey).toEqual(fakeSurvey)
    })
  })
})
