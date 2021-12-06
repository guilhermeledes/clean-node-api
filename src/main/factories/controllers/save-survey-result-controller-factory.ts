import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadAnswersBySurvey, makeDbSaveSurveyResult } from '@/main/factories/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const surveyController = new SaveSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(surveyController)
}
