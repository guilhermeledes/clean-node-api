import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../helper/http/http-helper'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error|null { return null }
  }
  return new ValidationStub()
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }]
  }
})

describe('AddSurveyController', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const httpeRequest = makeFakeHttpRequest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpeRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpeRequest.body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
