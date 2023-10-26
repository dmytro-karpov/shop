import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { Product } from '@shared/types';

const dynamoDBClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const fetchProductsByIds = async event => {
  const productIds = event.productIds;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    throw new Error('Invalid request.');
  }

  const products = await getProductsFromDB(productIds);
  return products;
};

const getProductsFromDB = async (productIds: string[]): Promise<Product[]> => {
  const table = process.env.PRODUCT_TABLE_NAME;
  const keys = productIds.map(id => ({ id }));

  const command = new BatchGetCommand({
    RequestItems: {
      [table]: {
        Keys: keys,
      },
    },
  });

  const response = await ddbDocClient.send(command);

  return (response.Responses ? response.Responses[table] : []) as Product[];
};

export const main = fetchProductsByIds;
