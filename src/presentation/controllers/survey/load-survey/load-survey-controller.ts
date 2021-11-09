import { noContent, ok, serverError } from '@/presentation/helper/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-survey-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return (surveys.length === 0) ? noContent() : ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
