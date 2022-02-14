const express = require('express')
const morgan = require('morgan')
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express()

mongoose.connect('mongodb+srv://dbUser:Asdf!234@cluster0.npmcz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');
const cartRoutes = require('./routes/cart.js');
const checkoutRoutes = require('./routes/checkout.js');
const userRoutes = require('./routes/user.js')
require('./background');

app.use(morgan('dev'));
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

app.use(cors());

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/user', userRoutes);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message : error.message
    })
})

module.exports = app;