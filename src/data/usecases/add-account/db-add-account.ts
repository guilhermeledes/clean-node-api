import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    const accountModel = {
      id: 'string',
      name: 'string',
      email: 'string',
      password: 'string'
    }
    return await new Promise<AccountModel>(resolve => resolve(accountModel))
  }
}
