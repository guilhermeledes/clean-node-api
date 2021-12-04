import { makeAddSurveyValidation } from '@/main/factories/controllers'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbAddSurvey } from '@/main/factories/usecases'
import { AddSurveyController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeAddSurveyController = (): Controller => {
  const surveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(surveyController)
}
