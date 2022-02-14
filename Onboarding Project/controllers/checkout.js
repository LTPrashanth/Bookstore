const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const utility = require('../utility/utility');
const Queue = require('bull');

const User = require('../models/user');
const Book = require('../models/books');
const Order = require('../models/orders');
const Cart = require('../models/cart');

const { resourceLimits } = require('worker_threads');
const { findByIdAndUpdate } = require('../models/user');

exports.postProceedToCheckout = async (req, res, next) => {

    try{
        const userId = req.body.userId;
        
        const cart = await Cart.findOne({user_id: userId}).exec();

        if(!cart){
            throw new Error("Cart does not exist");
        }

        if(cart.books.length < 1){
            throw new Error("Cart is empty");
        }

        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            user_id: userId,
            total: cart.total,
            status: "PENDING",
            payment: "PENDING",
            address: " ",
            books: cart.books
        });

        
        await order.save();
        res.status(200).json({
            message: "Order Created",
            orderId: order._id
        })
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}

exports.postAddAddress = async (req, res, next) => {
    try{
        const orderId = req.params.orderId;
        const address = req.body.address;
        const userId = req.body.userId;

        if(!address) {
            throw new Error("Address not Valid")
        }

        if(!orderId){
            throw new Error("Order does not exist");
        }

        const filter = {_id : orderId};
        const update = {address : address, status: "PROCESSING"};

        await Order.findByIdAndUpdate(filter, update);

        res.status(200).json({
            message: "Address selected",
            address: address,
            orderId: orderId
        })

        
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}

exports.postPayment = async (req, res, next) => {
    try{
        const userId = req.body.userId;
        const orderId = req.body.orderId;
        const payment = req.body.payment;

        console.log("check 1");

        if(payment === "true") {

            const cart = await Cart.findOne({user_id: userId});

            const oldBookList = cart.books;

            console.log("check 2");

            oldBookList.forEach(async element => {
                const bookId = element.product;
                const quantity = parseInt(element.quantity);

                const book = await Book.findOne({_id: bookId});
                const newQuantity = book.stock - quantity;

                console.log(newQuantity);
                
                const filter = {_id: bookId};
                const update = {stock: newQuantity};

                
                const sendNotifQueue = new Queue('notif', {
                    redis: {
                        host: '127.0.0.1',
                        port: 6379,
                        password: 'root'
                    }
                    });
                
                if(newQuantity <= 2) {
                      const data = {
                        bookId: bookId,
                        title: book.title
                      };
                      
                      const options = {
                        delay: 6000
                      };

                      sendNotifQueue.add(data, options);
                }
                if(newQuantity != 0){
                    console.log("not empty")
                    await Book.findByIdAndUpdate(filter, update);
                }
                else{
                    console.log("empty");
                    await Book.findByIdAndDelete(bookId);
                }
            });

            const bookList = [];
            const newTotal = 0;

            const orderFilter = {_id: orderId};
            const orderUpdate = {payment: "COMPLETED"};

            const cartFilter = {user_id: userId};
            const cartUpdate = {books: bookList, total: newTotal, status: "CLOSE"};

            await Order.findByIdAndUpdate(orderFilter, orderUpdate);
            await Cart.findOneAndUpdate(cartFilter, cartUpdate);

            res.status(200).json({
                message: "Transaction Completed"
            })
        }
        else{
            throw new Error("Payment pending");
        }
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }

}