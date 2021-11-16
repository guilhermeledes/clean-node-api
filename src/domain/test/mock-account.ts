import { AccountModel, AddAccountParams } from '@/data/usecases/add-account/db-add-account-protocols'
import { AuthenticationParams } from '@/data/usecases/authentication/db-authentication-protocols'

export const mockAddAccountParams = (): AddAccountParams => (
  {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
