# School Payments Backend

A Node.js/Express backend for managing school payment orders, transactions, and webhooks, with JWT authentication and MongoDB for persistence.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Payments](#payments)
  - [Transactions](#transactions)
  - [Webhook](#webhook)
- [Seeding Dummy Data](#seeding-dummy-data)
- [Project Structure](#project-structure)

---

## Features

- User registration and login with JWT authentication
- Create payment orders and initiate payment requests
- Track order and transaction status
- Webhook endpoint for payment gateway callbacks
- MongoDB models for users, orders, order statuses, and webhook logs

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- Winston for logging

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd school-payments/backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (see below).

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=1d

PAYMENT_API_BASE_URL=<payment-api-base-url>
PAYMENT_CREATE_COLLECT_URL=<payment-create-collect-url>
PAYMENT_API_KEY=<payment-api-key>
PG_KEY=<payment-gateway-secret-key>

SCHOOL_ID=<default-school-id>
FRONTEND_URL=<frontend-url>
```

## Running the Server

- **Development:**
  ```sh
  npm run dev
  ```
- **Production:**
  ```sh
  npm start
  ```

Server will run at `http://localhost:<PORT>/`.

---

## API Endpoints

### Auth

#### Register

- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "name": "User Name"
  }
  ```
- **Response:**  
  `201 Created`  
  `{ "message": "User created" }`

#### Login

- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**  
  `201 Created`  
  `{ "message": "User loggedin", "token": "<jwt>", "user": { ... } }`

---

### Payments

#### Create Payment

- **POST** `/payments/create-payment`
- **Headers:**  
  `Authorization: Bearer <jwt>`
- **Body:**
  ```json
  {
    "order_amount": 1200,
    "student_info": {
      "name": "Student Name",
      "id": "S1234",
      "email": "student@email.com"
    },
    "gateway_name": "GatewayName",
    "school_id": "<school-object-id>",
    "trustee_id": "<trustee-object-id>"
  }
  ```
- **Response:**  
  `200 OK`  
  ```json
  {
    "message": "Payment initiated successfully",
    "payment_url": "<url>",
    "custom_order_id": "<id>",
    "order": { ... },
    "orderStatus": { ... }
  }
  ```

---

### Transactions

#### Get All Transactions

- **GET** `/transactions`
- **Headers:**  
  `Authorization: Bearer <jwt>`
- **Query Params:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `sort` (default: createdAt)
  - `order` (asc/desc, default: desc)
  - `status` (optional: success/pending/failed)
- **Response:**  
  `200 OK`  
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 100,
    "data": [ ... ]
  }
  ```

#### Get Transactions by School

- **GET** `/transactions/school/:schoolId`
- **Headers:**  
  `Authorization: Bearer <jwt>`
- **Response:**  
  `200 OK`  
  `{ "data": [ ... ] }`

#### Get Transaction Status

- **GET** `/transactions/transaction-status/:custom_order_id`
- **Headers:**  
  `Authorization: Bearer <jwt>`
- **Response:**  
  `200 OK`  
  ```json
  {
    "collect_id": "<order-object-id>",
    "custom_order_id": "<id>",
    "school_id": "<school-object-id>",
    "gateway": "<gateway>",
    "order_amount": 1200,
    "transaction_amount": 1200,
    "status": "success",
    "createdAt": "<date>"
  }
  ```

---

### Webhook

#### Payment Status Update Webhook

- **POST** `/webhook`
- **Body:**  
  e.g.:
  ```json
  {
    "order_info": {
      "order_id": "<custom_order_id or order._id>",
      "order_amount": 1200,
      "transaction_amount": 1200,
      "bank_reference": "BANKREF123",
      "status": "success",
      "payment_mode": "UPI",
      "payment_details": "...",
      "payment_message": "...",
      "error_message": "",
      "payment_time": "2024-06-01T12:00:00Z"
    }
  }
  ```
- **Response:**  
  `200 OK`  
  `{ "message": "ok", "updated": { ... } }`

---

## Seeding Dummy Data

To seed the database with sample orders and statuses:

```sh
npm run seed
```

This will clear existing orders and statuses and insert 10 new sample records.

---

## Project Structure

```
backend/
  app.js
  index.js
  package.json
  .env
  config/
    config.js
  controllers/
    auth.controller.js
    payment.controller.js
    transaction.controller.js
    webhook.controller.js
  middlewares/
    auth.middleware.js
    error.middleware.js
    validate.middleware.js
  models/
    order.model.js
    orderStatus.model.js
    user.model.js
    webhookLog.model.js
  routes/
    auth.routes.js
    payment.routes.js
    transaction.routes.js
    webhook.routes.js
  scripts/
    seedDummyData.js
  utils/
    logger.js
```

---

## Notes

- All protected endpoints require a valid JWT in the `Authorization` header.
- Webhook endpoint should be configured in your payment gateway dashboard.
- Adjust `.env` values as per your environment and payment gateway credentials.

---

For any issues or contributions, please open an issue or