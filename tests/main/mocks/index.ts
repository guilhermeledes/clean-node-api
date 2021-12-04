import env from '@/main/config/env'
import { mockAddAccountParams } from '@/tests/domain/mocks'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
export const mockAccessToken = async (accountCollection: Collection, role?: string): Promise<string> => {
  const res = await accountCollection.insertOne({
    ...mockAddAccountParams(),
    role
  })
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: { accessToken }
  })
  return accessToken
}
