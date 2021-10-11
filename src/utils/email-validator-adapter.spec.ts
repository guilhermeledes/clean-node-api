import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Shoult return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })
})
