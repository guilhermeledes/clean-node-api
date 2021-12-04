import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const surveyController = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(surveyController)
}
