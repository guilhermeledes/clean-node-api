import { AddAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'
import { mockAuthenticationModel } from '@/tests/domain/mocks'
import faker from 'faker'

export class AddAccountSpy implements AddAccount {
  params: AddAccount.Params
  result = true

  async add (data: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = data
    return await Promise.resolve(this.result)
  }
}

export class AuthenticationSpy implements Authentication {
  params: Authentication.Params
  result: Authentication.Result = mockAuthenticationModel()

  async auth (data: Authentication.Params): Promise<Authentication.Result> {
    this.params = data
    return await Promise.resolve(this.result)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  result = { id: faker.datatype.uuid() }
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return await Promise.resolve(this.result)
  }
}
