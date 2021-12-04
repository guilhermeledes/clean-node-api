import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadSurveys } from '@/main/factories/usecases'
import { LoadSurveysController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const surveyController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(surveyController)
}
