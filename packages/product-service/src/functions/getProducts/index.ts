import { handlerPath } from '@shared/libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'products',
        method: 'get',
        // documentation: {
        //   summary: 'Get all products',
        //   description: 'Fetches all products from the database',
        //   responseBody: {
        //     description: 'List of products',
        //     schema: {
        //       type: 'array',
        //       items: {
        //         $ref: '#/components/schemas/Product',
        //       },
        //     },
        //   },
        //   response: {
        //     headers: {
        //       'Content-Type': {
        //         type: 'string',
        //         description: 'Content type of the response',
        //       },
        //     },
        //     description: 'Products fetched successfully',
        //   },
        // },
      },
    },
  ],
};
