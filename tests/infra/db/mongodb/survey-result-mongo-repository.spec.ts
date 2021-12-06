import { SurveyModel } from '@/domain/models'
import { SaveSurveyResult } from '@/domain/usecases'
import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import MockDate from 'mockdate'
import { Collection } from 'mongodb'

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

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.ops[0]._id
}

const mockSaveSurveyResultParams = (survey: SurveyModel, accountId: string, answerIndex: number = 0): SaveSurveyResult.Params => ({
  surveyId: survey.id,
  accountId,
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
      const accountId = await makeAccountId()
      const sut = makeSut()
      await sut.save(mockSaveSurveyResultParams(survey, accountId))
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId
      })
      expect(surveyResult).toBeTruthy()
    })

    test('Should update a surveyResult on success if its not new', async () => {
      const survey = await makeSurvey()
      const accountId = await makeAccountId()
      const saveSurveyResultParams = mockSaveSurveyResultParams(survey, accountId)
      await surveyResultCollection.insertOne(saveSurveyResultParams)
      const newAnswer = survey.answers[1].answer
      const sut = makeSut()
      await sut.save({
        ...saveSurveyResultParams,
        answer: newAnswer
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answer).toBe(newAnswer)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load surveyResult on success', async () => {
      const survey = await makeSurvey()
      const accountId1 = await makeAccountId()
      const accountId2 = await makeAccountId()
      const accountId3 = await makeAccountId()
      const accountId4 = await makeAccountId()
      await surveyResultCollection.insertMany([
        mockSaveSurveyResultParams(survey, accountId1, 0),
        mockSaveSurveyResultParams(survey, accountId2, 1),
        mockSaveSurveyResultParams(survey, accountId3, 1),
        mockSaveSurveyResultParams(survey, accountId4, 0)
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId1)
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
      const accountId1 = await makeAccountId()
      const accountId2 = await makeAccountId()
      const accountId3 = await makeAccountId()
      const accountId4 = await makeAccountId()
      await surveyResultCollection.insertMany([
        mockSaveSurveyResultParams(survey, accountId1, 0),
        mockSaveSurveyResultParams(survey, accountId2, 1),
        mockSaveSurveyResultParams(survey, accountId3, 1)
      ])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId4)
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
      const accountId = await makeAccountId()
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId)
      expect(surveyResult).toBeNull()
    })
  })
})
