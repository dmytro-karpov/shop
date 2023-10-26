import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { v4 as uuidv4 } from 'uuid';

import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@shared/libs/api-gateway';
import { middyfy } from '@shared/libs/lambda';
import { CartOrderItem, OrderProduct, Product } from '@shared/types';
import { generateInvoices } from './generateInvoices';

import schema from './schema';

const lambda = new LambdaClient();
const snsClient = new SNSClient();

export const submitOrder: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async event => {
  const cartItems: CartOrderItem[] = event.body;

  const products: Product[] = await fetchProducts(
    cartItems,
    `product-service-${event.requestContext.stage}-getProductsByIds`
  );
  const orderId = uuidv4();
  console.log(event);
  console.log(products);

  const orderProducts: OrderProduct[] = cartItems.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);

    if (!product) {
      throw new Error(`Product with ID ${cartItem.productId} not found!`);
    }

    return {
      ...product,
      quantity: cartItem.quantity,
    };
  });

  console.log(orderProducts);

  const { subTotal, vat, total } = calculateOrderDetails(orderProducts);

  const invoices = generateInvoices(orderProducts);

  await sendSNSEvent(orderId);

  return formatJSONResponse({
    subTotal,
    vat,
    total,
    invoices,
    orderId,
  });
};

const fetchProducts = async (
  cartItems: CartOrderItem[],
  functionToInvoke: string
): Promise<Product[]> => {
  const payload = JSON.stringify({
    productIds: cartItems.map(item => item.productId),
  });

  const invokeCommand = new InvokeCommand({
    FunctionName: functionToInvoke,
    Payload: payload,
  });

  const response = await lambda.send(invokeCommand);

  if (response.Payload) {
    console.log(response.Payload.toString());
    return JSON.parse(Buffer.from(response.Payload).toString());
  }

  throw new Error('Failed to fetch products from Product Service.');
};

function calculateOrderDetails(products: OrderProduct[]): {
  subTotal: number;
  vat: number;
  total: number;
} {
  let subTotal = 0;
  let vat = 0;

  products.forEach(product => {
    const productTotal = product.price * product.quantity;
    const discount = product.discount
      ? (productTotal * product.discount) / 100
      : 0;
    subTotal += productTotal - discount;
    vat += Math.round(
      ((productTotal - discount) * (product.vatRate || 0)) / 100
    );
  });

  return {
    subTotal,
    vat,
    total: subTotal + vat,
  };
}

const sendSNSEvent = async (orderId: string) => {
  const params = {
    Message: JSON.stringify({
      orderId,
    }),
    TopicArn: process.env.NEW_ORDER_TOPIC,
    MessageAttributes: {
      type: {
        DataType: 'String.Array',
        StringValue: '["NEW_ORDER"]',
      },
    },
  };

  await snsClient.send(new PublishCommand(params));
};

export const main = middyfy(submitOrder);
