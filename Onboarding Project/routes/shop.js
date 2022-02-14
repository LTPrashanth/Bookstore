const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getBooks);

router.get('/:bookId', shopController.getBookById);

module.exports = router;