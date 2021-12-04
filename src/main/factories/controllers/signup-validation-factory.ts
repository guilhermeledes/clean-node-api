import { EmailValidatorAdapter } from '@/infra/validators'
import { Validation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'

const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirmation']
  .map(
    field => new RequiredFieldValidation(field)
  )
validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

export const makeSignUpValidation = (): ValidationComposite => new ValidationComposite(validations)
