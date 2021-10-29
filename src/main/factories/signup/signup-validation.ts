import { CompareFieldsValidation } from '../../../presentation/helper/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helper/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helper/validators/required-field-validation'
import { Validation } from '../../../presentation/helper/validators/validation'
import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

const validations: Validation[] = ['name', 'email', 'password', 'passwordConfirmation']
  .map(
    field => new RequiredFieldValidation(field)
  )
validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

export const makeSignUpValidation = (): ValidationComposite => new ValidationComposite(validations)
