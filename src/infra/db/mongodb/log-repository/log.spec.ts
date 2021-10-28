import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repostitory', () => {
  let errerCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errerCollection = MongoHelper.getCollection('errors')
    await errerCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errerCollection.countDocuments()
    expect(count).toBe(1)
  })
})
