const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const authCtrl = require('../controllers/auth.controller');

router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], validate, authCtrl.register);

router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
], validate, authCtrl.login);

module.exports = router;
