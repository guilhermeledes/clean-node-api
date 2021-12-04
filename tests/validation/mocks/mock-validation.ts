import { Validation } from '@/presentation/protocols'

export class ValidationSpy implements Validation {
  validate (): Error {
    return null
  }
}
