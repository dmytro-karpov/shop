import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const ddbClient = new DynamoDBClient();

export const handler = async event => {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body);

  if (body && body.orderId) {
    const updateCommand = new UpdateItemCommand({
      TableName: process.env.WS_TABLE_NAME,
      Key: marshall({ connectionId: connectionId }),
      UpdateExpression: 'SET orderId = :orderId',
      ExpressionAttributeValues: marshall({
        ':orderId': body.orderId,
      }),
    });

    await ddbClient.send(updateCommand);

    return {
      statusCode: 200,
      body: `Order ID ${body.orderId} associated with connection.`,
    };
  } else {
    return {
      statusCode: 400,
      body: 'No orderId provided in the message.',
    };
  }
};

export const main = handler;
