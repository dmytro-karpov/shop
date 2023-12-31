import { handlerPath } from '@shared/libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'products',
        method: 'get',
        cors: {
          origin: '*',
        },
      },
    },
  ],
};
