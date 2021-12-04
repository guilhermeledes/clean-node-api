import { makeAddSurveyValidation } from '@/main/factories/controllers'
import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = ['question', 'answers']
      .map(
        field => new RequiredFieldValidation(field)
      )

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
