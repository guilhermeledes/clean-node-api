import { EmailValidation } from '../../../presentation/helper/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helper/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

const validations: Validation[] = ['email', 'password']
  .map(
    field => new RequiredFieldValidation(field)
  )
validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

export const makeLoginValidation = (): ValidationComposite => new ValidationComposite(validations)
