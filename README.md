# The Shop

This project uses Serverless Framework (SLS v3) for deploying backend services and Vite React for the frontend application.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Deployment](#deployment)
3. [Environment Variables](#environment-variables)

## Getting Started

Before deploying the services or the frontend, ensure that you have the required setup and dependencies installed.

### Prerequisites

- [Node.js](https://nodejs.org/) >=18.18.0
- [Yarn](https://yarnpkg.com/)
- [Serverless Framework](https://www.serverless.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone [REPO_URL]
   ```

2. Navigate to the project directory:
   ```bash
   cd [PROJECT_NAME]
   ```

3. Install the required dependencies:
   ```bash
   yarn install
   ```

## Deployment

### Backend Services

Deploy `checkout-service` and `product-service`:

```bash
sls deploy
```

### Frontend

To deploy the frontend, follow these steps:

1. Deploy using Serverless:
   ```bash
   sls deploy
   ```

2. Deploy the client:
   ```bash
   yarn client:deploy
   ```

## Environment Variables

For the frontend to work correctly, you need to set up environment variables. Below is an example configuration:

```bash
VITE_PRODUCT_SERVICE_URL=https://1.execute-api.eu-central-1.amazonaws.com/dev/products
VITE_CHECKOUT_SERVICE_URL=https://1.execute-api.eu-central-1.amazonaws.com/dev/submit
VITE_WS_SERVICE_URL=wss://1.execute-api.eu-central-1.amazonaws.com/dev
```

Save these in a `.env` file in the root of your frontend directory.
