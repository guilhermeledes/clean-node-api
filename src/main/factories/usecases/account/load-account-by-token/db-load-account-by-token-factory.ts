import { DbLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountRepository)
}
