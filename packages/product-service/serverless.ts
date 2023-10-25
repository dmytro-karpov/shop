import type { AWS } from '@serverless/typescript';

import { getProducts } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
      PRODUCT_TABLE_NAME: { Ref: 'ProductTable' },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:Query', 'dynamodb:Scan'],
            Resource: [
              {
                'Fn::GetAtt': ['ProductTable', 'Arn'],
              },
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { getProducts },
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
  },
  resources: {
    Resources: {
      ProductTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Product',
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
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
    },
    Outputs: {
      ProductTableName: {
        Value: '!Ref ProductTable',
        Description: 'Product table',
      },
    },
  },
};

module.exports = serverlessConfiguration;
