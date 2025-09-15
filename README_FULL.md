# School Payments App

A full-stack application for managing school payment orders, transactions, and webhooks.  
Built with **Node.js/Express, MongoDB, React, Redux, and Tailwind CSS**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Frontend Pages & Functionality](#frontend-pages--functionality)
- [Seeding Dummy Data](#seeding-dummy-data)
- [Project Structure](#project-structure)
- [Notes](#notes)

---

## Overview

The **School Payments App** consists of:
- **Backend (Node.js/Express + MongoDB):** Handles authentication, payment orders, transactions, and webhooks.
- **Frontend (React + Redux + Tailwind CSS):** A dashboard for schools/admins to manage and view transactions.

---

## Features

### Backend
- JWT authentication for users.
- Create and track payment orders.
- Transaction history with filters & pagination.
- Webhook endpoint for payment gateway callbacks.
- Logging with Winston.

### Frontend
- Register and login with JWT.
- Dashboard to view, filter, and sort transactions.
- Search transactions by school ID.
- Check transaction status using custom order ID.
- Dark/light theme toggle (persisted in `localStorage`).
- Copy-to-clipboard for IDs.
- Tailwind CSS UI.

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Winston  
- **Frontend:** React, Redux Toolkit, Axios, Tailwind CSS, Vite  

---

## Setup & Installation

### Backend

```sh
git clone <your-repo-url>
cd school-payments/backend
npm install
```

### Frontend

```sh
git clone <your-repo-url>
cd school-payments/frontend
npm install
```

---

## Environment Variables

### Backend `.env`
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

### Frontend `.env`
```
VITE_BACKEND_URL=http://localhost:3000
```

---

## Running the App

### Backend
- Development:
  ```sh
  npm run dev
  ```

Backend runs at: `http://localhost:3000/`

### Frontend
- Development:
  ```sh
  npm run dev
  ```
- Production build:
  ```sh
  npm run build
  npm run preview
  ```

Frontend runs at: `http://localhost:5173/`

---

## API Endpoints

(From backend)

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Payments
- `POST /payments/create-payment`

### Transactions
- `GET /transactions`
- `GET /transactions/school/:schoolId`
- `GET /transactions/transaction-status/:custom_order_id`

### Webhook
- `POST /webhook` — for payment gateway status updates

---

## Frontend Pages & Functionality

1. **Dashboard (`/`)**  
   - View/filter/sort transactions  
   - Make payments  
   - Copy IDs  
   - Paginated results  

2. **School Transactions (`/school`)**  
   - Search by school ID  
   - Filter by status  

3. **Check Status (`/check-status`)**  
   - Check transaction status by custom order ID  

4. **Login (`/login`)**  
   - Email + password authentication  

5. **Sign Up (`/signup`)**  
   - Create new user account  

6. **Header (Navigation)**  
   - Links to pages  
   - Theme toggle  
   - Login/Logout  

---

## Seeding Dummy Data

To insert sample orders/statuses into DB:

```sh
npm run seed
```

This clears old data and inserts 10 new records.

---

## Project Structure

```
school-payments/
  backend/
    app.js
    index.js
    controllers/
    middlewares/
    models/
    routes/
    scripts/
    utils/
  frontend/
    src/
      components/
      pages/
      store/
      utils/
      App.jsx
      main.jsx
```

---

## Details in each folder
