import { Controller, HttpRequest, Middleware } from '../../presentation/protocols'
import { Request, Response, RequestHandler, NextFunction } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptMiddleware: Adapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
