import { handlerPath } from '@shared/libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      websocket: {
        route: '$connect',
      },
    },
    {
      websocket: {
        route: '$disconnect',
      },
    },
  ],
};
