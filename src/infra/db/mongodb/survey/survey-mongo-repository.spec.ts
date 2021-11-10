import { Collection } from 'mongodb'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import MockDate from 'mockdate'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeSurvey = (prefix: string = 'any'): AddSurveyModel => ({
  question: `${prefix}_question`,
  answers: [
    { answer: `${prefix}_answer`, image: `${prefix}_image` }
  ],
  date: new Date()
})

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
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurvey())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([makeFakeSurvey(), makeFakeSurvey('other')])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toEqual('any_question')
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toEqual('other_question')
    })

    test('Should return an empty list if there are no surveys', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      await surveyCollection.insertOne({ ...makeFakeSurvey(), _id: 'any_id' })
      const fakeSurvey = { ...makeFakeSurvey(), id: 'any_id' }
      const sut = makeSut()
      const survey = await sut.loadById('any_id')
      expect(survey.id).toEqual('any_id')
      expect(survey).toEqual(fakeSurvey)
    })
  })
})
