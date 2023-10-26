export default {
  type: 'array',
  items: {
    type: 'object',
    required: ['productId', 'quantity'],
    properties: {
      productId: {
        type: 'string',
      },
      quantity: {
        type: 'number',
        minimum: 0,
      },
    },
    additionalProperties: false,
  },
} as const;
