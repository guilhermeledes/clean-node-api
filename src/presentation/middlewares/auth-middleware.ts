import { AccessDeniedError } from '../errors'
import { forbidden } from '../helper/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
