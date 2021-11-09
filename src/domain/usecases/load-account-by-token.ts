import { AccountModel } from '@/domain/models/account'

export type LoadAccountByToken = {
  load: (accessToken: string, role?: string) => Promise<AccountModel|null>
}
