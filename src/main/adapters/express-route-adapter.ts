import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response, RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptRoute: Adapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
