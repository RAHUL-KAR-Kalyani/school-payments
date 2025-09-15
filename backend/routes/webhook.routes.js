const express = require('express');
const router = express.Router();
const webhookCtrl = require('../controllers/webhook.controller');

router.post('/', webhookCtrl.updateTransactionStatus);

module.exports = router;
