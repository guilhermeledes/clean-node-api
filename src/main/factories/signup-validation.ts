import { RequiredFieldValidation } from '../../presentation/helper/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helper/validators/validation-composite'

const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  .map(
    field => new RequiredFieldValidation(field)
  )

export const makeSignUpValidation = (): ValidationComposite => new ValidationComposite([...requiredFields])
