import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Product } from '@shared/types';

import 'dotenv/config';

const client = new DynamoDBClient();

async function seedTable(products: Product[], tableName: string) {
  const MAX_BATCH_SIZE = 25;

  const batches = [];

  for (let i = 0; i < products.length; i += MAX_BATCH_SIZE) {
    const batch = products.slice(i, i + MAX_BATCH_SIZE).map(product => ({
      PutRequest: {
        Item: {
          id: { S: product.id.toString() },
          description: { S: product.description },
          discount: product.discount
            ? { N: product.discount.toString() }
            : { N: '0' },
          price: { N: product.price.toString() },
          quantityUnit: { S: product.quantityUnit },
          vatRate: { N: product.vatRate.toString() },
        },
      },
    }));

    batches.push(batch);
  }

  for (const batch of batches) {
    const command = new BatchWriteItemCommand({
      RequestItems: {
        [tableName]: batch,
      },
    });

    await client.send(command);
  }
}

const products: Product[] = [
  {
    id: '1',
    description: 'Water',
    price: 25,
    quantityUnit: 'piece',
    vatRate: 8,
  },
  {
    id: '2',
    description: 'Chips',
    price: 240,
    quantityUnit: 'piece',
    vatRate: 8,
  },
  {
    id: '3',
    description: 'TV',
    price: 76000,
    quantityUnit: 'piece',
    vatRate: 22,
  },
  {
    id: '4',
    description: 'Coca Cola',
    discount: 10,
    price: 50,
    quantityUnit: 'piece',
    vatRate: 18,
  },
  {
    id: '5',
    description: 'Chocolate Bars',
    price: 125,
    quantityUnit: 'piece',
    vatRate: 22,
  },
  {
    id: '6',
    description: 'Hand Soap',
    price: 378,
    quantityUnit: 'piece',
    vatRate: 8,
  },
  {
    id: '7',
    description: 'Fish Meat',
    price: 830,
    quantityUnit: 'kg',
    vatRate: 18,
  },
  {
    id: '8',
    description: 'Humus',
    price: 266,
    quantityUnit: 'piece',
    vatRate: 18,
  },
  {
    id: '9',
    description: 'White Wine',
    discount: 2,
    price: 920,
    quantityUnit: 'piece',
    vatRate: 18,
  },
  {
    id: '10',
    description: 'Bananas',
    price: 125,
    quantityUnit: 'kg',
    vatRate: 22,
  },
  {
    id: '11',
    description: 'Wine',
    price: 978,
    quantityUnit: 'piece',
    vatRate: 22,
  },
  {
    id: '12',
    description: 'Oil',
    price: 8300,
    quantityUnit: 'piece',
    vatRate: 18,
  },
  {
    id: '13',
    description: 'Cigarettes',
    price: 546,
    quantityUnit: 'piece',
    vatRate: 22,
  },
  {
    id: '14',
    description: 'Cookies',
    price: 134,
    quantityUnit: 'piece',
    vatRate: 8,
  },
  {
    id: '15',
    description: 'Yogurts',
    price: 66,
    quantityUnit: 'piece',
    vatRate: 18,
  },
  {
    id: '16',
    description: 'Bleach',
    price: 123,
    quantityUnit: 'piece',
    vatRate: 22,
  },
  {
    id: '17',
    description: 'Napkins',
    price: 21,
    quantityUnit: 'piece',
    vatRate: 8,
  },
  {
    id: '18',
    description: 'Eggs',
    price: 16,
    quantityUnit: 'piece',
    vatRate: 18,
  },
  {
    id: '19',
    description: 'Plastic Bags',
    price: 5,
    quantityUnit: 'piece',
    vatRate: 18,
  },
  {
    id: '20',
    description: 'Aluminum Foils',
    price: 112,
    quantityUnit: 'piece',
    vatRate: 8,
  },
  {
    id: '21',
    description: 'Razors',
    price: 810,
    quantityUnit: 'piece',
    vatRate: 8,
  },
  {
    id: '22',
    description: 'Lotions',
    price: 1200,
    quantityUnit: 'piece',
    vatRate: 22,
  },
];

seedTable(products, process.env.PRODUCT_TABLE_NAME)
  .then(() => console.log('Done!'))
  .catch(err => console.error(err));
