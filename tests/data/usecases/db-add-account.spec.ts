import { DbAddAccount } from '@/data/usecases'
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/tests/data/mocks'
import { mockAccountModel, mockAddAccountParams } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.accountModel = null
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)

  return { sut, hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { hasherSpy, sut } = makeSut()
    const params = mockAddAccountParams()
    await sut.add(params)
    expect(hasherSpy.plaintext).toBe(params.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { hasherSpy, sut } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositorySpy, hasherSpy, sut } = makeSut()
    const params = mockAddAccountParams()
    await sut.add(params)
    expect(addAccountRepositorySpy.params).toEqual({
      name: params.name,
      email: params.email,
      password: hasherSpy.digest
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositorySpy, sut } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const params = mockAddAccountParams()
    await sut.add(params)
    expect(loadAccountByEmailRepositorySpy.email).toBe(params.email)
  })

  test('Should return false if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const isValid = await sut.add(mockAddAccountParams())
    await expect(isValid).toBe(false)
  })

  test('Should return an true if LoadAccountByEmailRepository returns an account', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(mockAddAccountParams())
    await expect(isValid).toEqual(true)
  })
})
