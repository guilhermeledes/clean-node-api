import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean { return true }
}))

describe('EmailValidator Adapter', () => {
  test('Shoult return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })

  test('Shoult return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid@mail.com')
    expect(isValid).toBe(true)
  })
})
