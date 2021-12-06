import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const surveyController = new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(surveyController)
}
