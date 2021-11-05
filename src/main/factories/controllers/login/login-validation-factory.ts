import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '../../../../presentation/helper/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

const validations: Validation[] = ['email', 'password']
  .map(
    field => new RequiredFieldValidation(field)
  )
validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

export const makeLoginValidation = (): ValidationComposite => new ValidationComposite(validations)
