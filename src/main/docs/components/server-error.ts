export const serverError = {
  description: 'Erro interno da aplicação',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
