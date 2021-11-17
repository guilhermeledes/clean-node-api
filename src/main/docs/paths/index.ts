import { loginPath } from './login'
import { signupPath } from './signup'
import { surveyPath } from './survey'
import { surveyResultPath } from './survey-result'

export default {
  '/login': loginPath,
  '/signup': signupPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
