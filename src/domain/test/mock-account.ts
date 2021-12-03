import { AccountModel, AddAccountParams } from '@/data/usecases/add-account/db-add-account-protocols'
import { AuthenticationParams } from '@/data/usecases/authentication/db-authentication-protocols'
import { AuthenticationModel } from '../models/authentication'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccountParams => (
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })

export const mockAccountModel = (): AccountModel => ({
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationModel = (): AuthenticationModel => ({
  name: faker.name.findName(),
  accessToken: faker.internet.password()
})
