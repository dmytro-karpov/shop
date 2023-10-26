import { fetchProductsByIds } from './handler';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const originalModule = jest.requireActual('@aws-sdk/lib-dynamodb');

  return {
    ...originalModule,
    DynamoDBDocumentClient: {
      from: jest.fn().mockReturnValue({
        send: jest.fn(),
      }),
    },
    BatchGetCommand: originalModule.BatchGetCommand,
  };
});

describe('fetchProductsByIds', () => {
  const mockDdbDocClientSend = DynamoDBDocumentClient.from({} as any)
    .send as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.PRODUCT_TABLE_NAME = 'testTable';
  });

  it('should throw error for invalid event', async () => {
    await expect(fetchProductsByIds({})).rejects.toThrow('Invalid request.');
    await expect(fetchProductsByIds({ productIds: 'invalid' })).rejects.toThrow(
      'Invalid request.'
    );
    await expect(fetchProductsByIds({ productIds: [] })).rejects.toThrow(
      'Invalid request.'
    );
  });

  it('should fetch products for valid productIds', async () => {
    const mockProductIds = ['1', '2'];
    const mockResponse = {
      Responses: {
        testTable: [
          { id: '1', description: 'Product A' },
          { id: '2', description: 'Product B' },
        ],
      },
    };

    mockDdbDocClientSend.mockResolvedValueOnce(mockResponse);

    const result = await fetchProductsByIds({ productIds: mockProductIds });
    expect(result).toEqual(mockResponse.Responses.testTable);
  });

  it('should handle DynamoDB errors', async () => {
    const mockProductIds = ['123'];
    mockDdbDocClientSend.mockRejectedValueOnce(new Error('DynamoDB error'));

    await expect(
      fetchProductsByIds({ productIds: mockProductIds })
    ).rejects.toThrow('DynamoDB error');
  });
});
