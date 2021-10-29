import { RequiredFieldValidation } from '../../presentation/helper/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helper/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helper/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      .map(
        field => new RequiredFieldValidation(field)
      )
    expect(ValidationComposite).toHaveBeenCalledWith(requiredFields)
  })
})
