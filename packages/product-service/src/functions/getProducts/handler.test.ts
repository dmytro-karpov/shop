import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import { getProducts } from './handler';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('getProducts', () => {
  afterEach(() => {
    ddbMock.reset();
  });

  it('should return a list of products', async () => {
    const mockResponse = {
      Items: [
        { id: '1', name: 'Product 1', price: 10 },
        { id: '2', name: 'Product 2', price: 20 },
      ],
    };

    ddbMock.on(ScanCommand).resolves(mockResponse);

    const response = await getProducts();
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();

    const body = JSON.parse(response.body);
    expect(body.items).toBeDefined();
    expect(Array.isArray(body.items)).toBe(true);
  });

  it('should return a 500 error if DynamoDB scan fails', async () => {
    ddbMock.on(ScanCommand).rejects(new Error('DynamoDB error'));

    const response = await getProducts();
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeDefined();

    const body = JSON.parse(response.body);
    expect(body.message).toBe('Internal Server Error');
  });
});
