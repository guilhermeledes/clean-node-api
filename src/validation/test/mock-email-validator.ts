import { EmailValidator } from '../protocols/email-validator'

export class EmailValidatorSpy implements EmailValidator {
  email: string
  isEmailValid: boolean = true

  isValid (email: string): boolean {
    this.email = email
    return this.isEmailValid
  }
}
