import { handlerPath } from '@shared/libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::GetAtt': ['NewOrderQueue', 'Arn'],
        },
      },
    },
  ],
};
