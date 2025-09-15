const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const paymentRoutes = require('./routes/payment.routes');
const webhookRoutes = require('./routes/webhook.routes');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();

app.use(cors({
    origin: "https://school-payment-frontend-r80f.onrender.com",
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);
app.use('/webhook', webhookRoutes);
app.use('/transactions', transactionRoutes);

app.use(errorMiddleware);

module.exports = app;
