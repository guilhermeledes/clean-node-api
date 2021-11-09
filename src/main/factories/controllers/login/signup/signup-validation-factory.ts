import {
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation
} from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirmation']
  .map(
    field => new RequiredFieldValidation(field)
  )
validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

export const makeSignUpValidation = (): ValidationComposite => new ValidationComposite(validations)
