import { LoadSurveys } from '@/domain/usecases'
import { noContent, ok, serverError } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest.accountId)
      return (surveys.length === 0) ? noContent() : ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
