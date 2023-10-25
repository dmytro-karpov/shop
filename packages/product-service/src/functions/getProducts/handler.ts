import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import { formatJSONResponse } from '@shared/libs/api-gateway';
import { middyfy } from '@shared/libs/lambda';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

export const getProducts = async () => {
  try {
    const command = new ScanCommand({
      TableName: process.env.PRODUCT_TABLE_NAME,
    });

    const result = await docClient.send(command);

    return formatJSONResponse({
      items: result.Items,
    });
  } catch (error) {
    return formatJSONResponse({ message: 'Internal Server Error' }, 500);
  }
};

export const main = middyfy(getProducts);
