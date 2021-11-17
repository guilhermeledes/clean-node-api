import { loginPath } from './paths/login'
import { account } from './schemas/account'
import { loginParams } from './schemas/login-params'

export default {
  openapi: '3.0.0',
  info: {
    title: 'API',
    version: '1.0.0'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account,
    loginParams
  }
}
