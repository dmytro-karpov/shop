import type { AWS } from '@serverless/typescript';

import {
  submitOrder,
  processNewOrder,
  wsConnection,
  wsDefault,
} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'checkout-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-export-env'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      NEW_ORDER_TOPIC: { Ref: 'NewOrderTopic' },
      ORDER_TABLE_NAME: { Ref: 'OrderTable' },
      WS_TABLE_NAME: { Ref: 'WebSocketConnectionsTable' },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['lambda:InvokeFunction'],
            Resource: [
              {
                'Fn::Sub':
                  'arn:aws:lambda:eu-central-1:${AWS::AccountId}:function:product-service-${sls:stage}-getProductsByIds',
              },
            ],
          },
          {
            Effect: 'Allow',
            Action: 'sns:Publish',
            Resource: { Ref: 'NewOrderTopic' },
          },
          {
            Effect: 'Allow',
            Action: ['dynamodb:PutItem'],
            Resource: [
              {
                'Fn::GetAtt': ['OrderTable', 'Arn'],
              },
            ],
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: [
              {
                'Fn::GetAtt': ['WebSocketConnectionsTable', 'Arn'],
              },
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { submitOrder, processNewOrder, wsConnection, wsDefault },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    stage: '${opt:stage, "dev"}',
  },
  resources: {
    Resources: {
      OrderTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Order',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      WebSocketConnectionsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'WebSocketConnections',
          AttributeDefinitions: [
            {
              AttributeName: 'connectionId',
              AttributeType: 'S',
            },
            {
              AttributeName: 'orderId',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'connectionId',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          GlobalSecondaryIndexes: [
            {
              IndexName: 'OrderIdIndex',
              KeySchema: [
                {
                  AttributeName: 'orderId',
                  KeyType: 'HASH',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
        },
      },
      NewOrderTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'New Order Notifications',
          TopicName: 'NewOrderTopic',
        },
      },
      NewOrderTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'sqs',
          TopicArn: {
            Ref: 'NewOrderTopic',
          },
          Endpoint: {
            'Fn::GetAtt': ['NewOrderQueue', 'Arn'],
          },
          FilterPolicy: {
            type: ['NEW_ORDER'],
          },
        },
      },
      NewOrderQueue: {
        Type: 'AWS::SQS::Queue',
      },
      NewOrderQueuePolicy: {
        Type: 'AWS::SQS::QueuePolicy',
        Properties: {
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  AWS: '*',
                },
                Action: 'sqs:SendMessage',
                Resource: {
                  'Fn::GetAtt': ['NewOrderQueue', 'Arn'],
                },
                Condition: {
                  ArnEquals: {
                    'aws:SourceArn': {
                      Ref: 'NewOrderTopic',
                    },
                  },
                },
              },
            ],
          },
          Queues: [
            {
              Ref: 'NewOrderQueue',
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
