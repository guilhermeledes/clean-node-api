import { Validation } from '@/presentation/protocols/validation'

export class ValidationSpy implements Validation {
  validate (): Error {
    return null
  }
}
