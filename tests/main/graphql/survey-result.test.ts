import { SurveyModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'
import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { mockAccessToken } from '@/tests/main/mocks'
import { ApolloServer, gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'

import { makeApolloServer } from './helpers'

let surveyCollection: Collection
let accountCollection: Collection
let apolloServer: ApolloServer

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return MongoHelper.map(res.ops[0])
}

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
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

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
      query surveyResult($surveyId: String!) {
        surveyResult (surveyId: $surveyId) {
          question
          answers {
            image
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    test('Should return SurveyResult on success', async () => {
      const survey = await makeSurvey()
      const accessToken = await mockAccessToken(accountCollection)
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveyResultQuery,{
        variables: {
          surveyId: survey.id.toString()
        }
      })
      expect(res.data.surveyResult.question).toBe(survey.question)
      expect(res.data.surveyResult.date).toBe(survey.date.toISOString())
      expect(res.data.surveyResult.answers).toEqual([
        ...survey.answers.map(answer => ({
          answer: answer.answer,
          image: answer.image,
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }))
      ])
    })
  })
})
