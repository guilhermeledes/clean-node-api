import { EmailValidatorAdapter } from '@/infra/validators'
import { Validation } from '@/presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

const validations: Validation[] = ['email', 'password']
  .map(
    field => new RequiredFieldValidation(field)
  )
validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

export const makeLoginValidation = (): ValidationComposite => new ValidationComposite(validations)
