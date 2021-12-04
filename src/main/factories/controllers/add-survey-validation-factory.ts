import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

const validations: Validation[] = ['question', 'answers']
  .map(
    field => new RequiredFieldValidation(field)
  )

export const makeAddSurveyValidation = (): ValidationComposite => new ValidationComposite(validations)
