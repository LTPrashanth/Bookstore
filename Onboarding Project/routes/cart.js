const path = require('path');


const express = require('express');

const cartController = require('../controllers/cart');

const checkAuth = require('../middleware/authentication');

const router = express.Router();

router.get('/', checkAuth, cartController.getCartItems);

router.post('/', checkAuth, cartController.postToCart);

router.delete('/', checkAuth, cartController.deleteFromCart);

module.exports = router;