import { SQSEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(dynamoClient);

export const processNewOrder = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    const { orderId } = JSON.parse(message.Message);

    // Simulate random success/failure
    if (Math.random() > 0.5) {
      await saveToDynamoDB(orderId);
      await sendWebSocketMessage(orderId, 'success');
    } else {
      await sendWebSocketMessage(orderId, 'failed');
    }
  }
};

const saveToDynamoDB = async (orderId: string) => {
  const params: PutCommandInput = {
    TableName: process.env.ORDER_TABLE_NAME,
    Item: {
      id: orderId,
    },
  };

  await ddbDocClient.send(new PutCommand(params));
};

const sendWebSocketMessage = async (orderId: string, message: string) => {
  const connectionId = await getConnectionIdByOrderId(orderId);
  const apiGatewayClient = new ApiGatewayManagementApiClient({
    endpoint: 'wss://za97a8ewzj.execute-api.eu-central-1.amazonaws.com/dev',
  });

  const params = {
    ConnectionId: connectionId,
    Data: message,
  };

  await apiGatewayClient.send(new PostToConnectionCommand(params));
};

const getConnectionIdByOrderId = async (orderId: string) => {
  const params = {
    TableName: process.env.WS_TABLE_NAME,
    IndexName: 'OrderIdIndex',
    KeyConditionExpression: 'orderId = :orderId',
    ExpressionAttributeValues: {
      ':orderId': orderId,
    },
  };

  try {
    const result = await ddbDocClient.send(new QueryCommand(params));
    if (result.Items && result.Items.length > 0) {
      return result.Items[0].connectionId;
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error retrieving connectionId by orderId:', err);
  }
};

export const main = processNewOrder;
