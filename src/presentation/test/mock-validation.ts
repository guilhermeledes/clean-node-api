import { Validation } from '../protocols'

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error { return null }
  }
  return new ValidationStub()
}
