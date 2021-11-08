import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-survey/load-survey-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '../../../usecases/survey/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const surveyController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(surveyController)
}
