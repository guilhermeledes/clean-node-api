import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

export const mockSaveSurveyResultParams = (survey?: SurveyModel, account?: AccountModel, answerIndex: number = 0): SaveSurveyResultParams => ({
  surveyId: survey?.id || 'any_account_id',
  accountId: account?.id || 'any_survey_id',
  answer: survey?.answers[answerIndex].answer || 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 0,
    percent: 0
  },{
    answer: 'other_answer',
    image: 'other_image',
    count: 0,
    percent: 0
  }],
  date: new Date(),
  question: 'any_question'
})
