import { handlerPath } from '@shared/libs/handler-resolver';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'submit',
        method: 'post',
        cors: {
          origin: '*',
        },
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
