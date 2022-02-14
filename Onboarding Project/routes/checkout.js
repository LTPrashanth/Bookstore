const path = require('path');

const express = require('express');

const checkoutController = require('../controllers/checkout.js');

const checkAuth = require('../middleware/authentication');

const router = express.Router();

router.post('/', checkAuth, checkoutController.postProceedToCheckout); 

router.post('/payment', checkAuth, checkoutController.postPayment);

router.post('/:orderId', checkAuth, checkoutController.postAddAddress);

module.exports = router;