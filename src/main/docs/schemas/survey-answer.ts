export const surveyAnswer = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    }
  },
  required: ['answer']
}
