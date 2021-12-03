import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel, mockAuthenticationModel } from '@/domain/test'
import { AuthenticationModel } from '@/domain/models/authentication'

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
