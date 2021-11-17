import {
  badRequest,
  notFound,
  serverError,
  unauthorized,
  forbidden
} from './components'
import {
  account,
  error,
  loginParams,
  apiKeyAuth,
  signUpParams
} from './schemas'
import {
  loginPath,
  signupPath
} from './paths'

export default {
  openapi: '3.0.0',
  info: {
    title: 'API',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0',
    url: 'https://www.gnu.org/licenses/gpl-3.0.en.html'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signupPath
  },
  schemas: {
    account,
    error,
    loginParams,
    signUpParams
  },
  components: {
    securitySchemes: { apiKeyAuth },
    badRequest,
    serverError,
    unauthorized,
    notFound,
    forbidden
  }
}
