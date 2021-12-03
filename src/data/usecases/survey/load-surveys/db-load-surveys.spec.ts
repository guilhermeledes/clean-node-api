import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'
import { LoadSurveysRepositorySpy } from '@/data/test'
import faker from 'faker'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)
  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  let accountId: string
  beforeEach(() => {
    accountId = faker.datatype.uuid()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    await sut.load(accountId)
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  test('Should return LoadSurveysRepository returned data', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const surveys = await sut.load(accountId)
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels)
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load(accountId)
    await expect(promise).rejects.toThrow()
  })
})
