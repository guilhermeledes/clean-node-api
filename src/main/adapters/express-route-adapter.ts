import { Controller } from '@/presentation/protocols'
import { Request, RequestHandler, Response } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptRoute: Adapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request: any = {
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(request)
    if ((httpResponse.statusCode >= 200) && (httpResponse.statusCode <= 299)) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
