import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

export const mockSaveSurveyResultParams = (survey?: SurveyModel, account?: AccountModel): SaveSurveyResultParams => ({
  surveyId: survey?.id || 'any_account_id',
  accountId: account?.id || 'any_survey_id',
  answer: survey?.answers[0].answer || 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 1,
    percent: 50
  },{
    answer: 'other_answer',
    count: 10,
    percent: 20
  }],
  date: new Date(),
  question: 'any_question'
})
