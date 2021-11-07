export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  headers?: { [key: string]: string }
  body?: any
}
