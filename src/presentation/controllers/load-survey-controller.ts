import { LoadSurveys } from '@/domain/usecases'
import { noContent, ok, serverError } from '@/presentation/helper'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      return (surveys.length === 0) ? noContent() : ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
