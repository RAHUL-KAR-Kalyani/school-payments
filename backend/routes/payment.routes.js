const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const paymentCtrl = require('../controllers/payment.controller');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');

router.post('/create-payment', auth, [
    body('order_amount').isNumeric()
], validate, paymentCtrl.createPayment);

module.exports = router;
