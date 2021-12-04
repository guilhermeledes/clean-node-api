import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers'
import { auth } from '@/main/middlewares'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
}
