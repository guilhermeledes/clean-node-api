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

    test('Should return AccessDeniedError if no valid token is provided', async () => {
      const survey = await makeSurvey()
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(surveyResultQuery,{
        variables: {
          surveyId: survey.id.toString()
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = gql`
      mutation saveSurveyResult($surveyId: String!, $answer: String!) {
        saveSurveyResult (surveyId: $surveyId, answer: $answer) {
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
      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await mutate(saveSurveyResultMutation,{
        variables: {
          surveyId: survey.id.toString(),
          answer: survey.answers[0].answer
        }
      })
      expect(res.data.saveSurveyResult.question).toBe(survey.question)
      expect(res.data.saveSurveyResult.date).toBe(survey.date.toISOString())
      expect(res.data.saveSurveyResult.answers).toEqual(expect.arrayContaining([
        ...survey.answers.map((answer, index) => ({
          answer: answer.answer,
          image: answer.image,
          count: index === 0 ? 1 : 0,
          percent: index === 0 ? 100 : 0,
          isCurrentAccountAnswer: index === 0
        }))
      ]))
    })

    test('Should return AccessDeniedError if no valid token is provided', async () => {
      const survey = await makeSurvey()
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(saveSurveyResultMutation,{
        variables: {
          surveyId: survey.id.toString(),
          answer: survey.answers[0].answer
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })
  })
})
