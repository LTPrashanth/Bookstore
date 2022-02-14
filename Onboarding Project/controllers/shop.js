const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const utility = require('../utility/utility')

const User = require('../models/user');
const Book = require('../models/books');
const Order = require('../models/orders');
const Cart = require('../models/cart');

exports.getBooks = async (req, res, next) => {
    await utility.getBooks(req, res, next);
};

exports.getBookById = async (req, res, next) => {
    await utility.getBookById(req, res, next)
};


  