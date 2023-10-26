import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const ddbClient = new DynamoDBClient();

export const handler = async event => {
  const connectionId = event.requestContext.connectionId;

  if (event.requestContext.eventType === 'CONNECT') {
    const item = marshall({
      connectionId: connectionId,
    });

    const putCommand = new PutItemCommand({
      TableName: process.env.WS_TABLE_NAME,
      Item: item,
    });

    await ddbClient.send(putCommand);

    return {
      statusCode: 200,
      body: 'Connected.',
    };
  } else if (event.requestContext.eventType === 'DISCONNECT') {
    const deleteCommand = new DeleteItemCommand({
      TableName: process.env.WS_TABLE_NAME,
      Key: marshall({ connectionId: connectionId }),
    });

    await ddbClient.send(deleteCommand);

    return {
      statusCode: 200,
      body: 'Disconnected.',
    };
  }
};

export const main = handler;
