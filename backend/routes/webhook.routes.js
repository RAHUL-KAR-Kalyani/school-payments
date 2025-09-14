const express = require('express');
const router = express.Router();
const webhookCtrl = require('../controllers/webhook.controller');

router.post('/', webhookCtrl.updateTransactionStatus);

// router.post("/webhook/payment", webhookCtrl.paymentWebhook);     /* no need */

module.exports = router;
