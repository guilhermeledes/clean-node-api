import { AccountModel, AuthenticationModel } from '@/domain/models'
import { AddAccount, AddAccountParams, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/usecases'
import { mockAccountModel, mockAuthenticationModel } from '@/tests/domain/mocks'

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccountParams
  accountModel: AccountModel = mockAccountModel()

  async add (data: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = data
    return await Promise.resolve(this.accountModel)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams
  authenticationModel: AuthenticationModel = mockAuthenticationModel()

  async auth (data: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = data
    return await Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: AccountModel = mockAccountModel()
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return await Promise.resolve(this.accountModel)
  }
}
