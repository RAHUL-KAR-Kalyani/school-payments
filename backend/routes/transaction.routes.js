const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const transactionCtrl = require('../controllers/transaction.controller');

router.get('/', auth, transactionCtrl.getAllTransactions);
router.get('/school/:schoolId', auth, transactionCtrl.getTransactionsBySchool);
// router.get('/transaction-status/', auth, transactionCtrl.getTransactionStatus);
router.get('/transaction-status/:custom_order_id', auth, transactionCtrl.getTransactionStatus);

module.exports = router;
