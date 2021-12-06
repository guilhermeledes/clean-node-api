import { LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import FakeObjectId from 'bson-objectid'
import MockDate from 'mockdate'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.ops[0]._id
}

const makeSurvey = async (): Promise<LoadSurveyByIdRepository.Result> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return MongoHelper.map(res.ops[0])
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
      const params = mockAddSurveyParams()
      await sut.add(params)
      const survey = await surveyCollection.findOne({ question: params.question })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      await surveyCollection.insertMany(addSurveyModels)
      const surveyDatas: LoadSurveysRepository.Result = MongoHelper.mapCollection(await surveyCollection.find().toArray())

      const accountId = await makeAccountId()
      await surveyResultCollection.insertOne({ accountId, surveyId: surveyDatas[0].id, answer: surveyDatas[0].answers[0].answer, date: new Date() })

      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toEqual(surveyDatas[0].id)
      expect(surveys[0].question).toBe(surveyDatas[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].id).toEqual(surveyDatas[1].id)
      expect(surveys[1].question).toBe(surveyDatas[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should return an empty list if there are no surveys', async () => {
      const accountId = await makeAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const surveyData = await makeSurvey()
      const sut = makeSut()
      const survey = await sut.loadById(surveyData.id)
      expect(survey).toEqual(surveyData)
    })
    test('Should return null if survey not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(new FakeObjectId().toHexString())
      expect(survey).toBeFalsy()
    })
  })
  describe('loadAnswers()', () => {
    test('Should load answers on success', async () => {
      const surveyData = await makeSurvey()
      const sut = makeSut()
      const answers = await sut.loadAnswers(surveyData.id)
      expect(answers).toEqual(surveyData.answers.map(answer => answer.answer))
    })
    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(new FakeObjectId().toHexString())
      expect(answers).toEqual([])
    })
  })
  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const surveyData = await makeSurvey()
      const sut = makeSut()
      const exists = await sut.checkById(surveyData.id)
      expect(exists).toEqual(true)
    })
    test('Should return false if survey not exists', async () => {
      const sut = makeSut()
      const exists = await sut.checkById(new FakeObjectId().toHexString())
      expect(exists).toEqual(false)
    })
  })
})
