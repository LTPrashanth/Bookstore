const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const utility = require('../utility/utility')

const User = require('../models/user');
const Book = require('../models/books');
const Order = require('../models/orders');
const Cart = require('../models/cart');
const { resourceLimits } = require('worker_threads');

exports.getCartItems = async (req, res, next) => {
    try{
        const user_id = req.body.user_id;

        const cart = await Cart.findOne({user_id: user_id}).select('total books _id user_id status');

        if(!cart){
            throw new Error("Cart not found")
        }

        else{
            res.status(200).json({
                message: "Cart fetched",
                cart: cart
            })
        }
        
    }
    catch(error){
        res.status(500).json({
            message: error.message
        })
    }
    
}

exports.postToCart = async (req, res, next) => {
    try{
        const book_id = mongoose.Types.ObjectId(req.body.book_id);
        const user_id = mongoose.Types.ObjectId(req.body.user_id);
        const quantity = parseInt(req.body.quantity) || 1;

        const result = await Cart.findOne({user_id: user_id}).exec();

        console.log(result);
        const books_list = result.books;

        const cur_book_id = books_list.find((book) => {
            if(book_id.equals(book.product)){
                return book_id;
            }
        })

        if(cur_book_id) {
            const book = await Book.findById(book_id);

            const newQuantity = cur_book_id.quantity + quantity;
            console.log("newQuantity is " + newQuantity);
            console.log(book);

            if(newQuantity > book.stock) {
                throw new Error("insuffecient stock");
            }

            const new_total = result.total + book.price*quantity;

            result.total = new_total;
            
            result.books.map((book) => {
                if(book_id.equals(book.product)){
                    book.quantity = newQuantity;
                }
            });

            console.log(result);
        }
        else {
            const book = await Book.findById(book_id);

            if(!book){
                throw new Error("bbok does not exist");
            }

            if(quantity > book.stock) {
                throw new Error("insuffecient stock");
            }

            const newObj = {product: book._id, quantity: quantity, _id: new mongoose.Types.ObjectId()};
            console.log(result.books);
            const tempObj = [
                ...result.books, newObj
            ]

            console.log(tempObj);
            result.books = tempObj;

            const new_total = result.total + book.price*quantity;
            result.total = new_total;
            
            console.log(result);

        }

        await Cart.findOneAndUpdate({user_id: user_id}, result).exec();

        res.status(200).json({
            message: "Book added",
            total: result.total,
            cart: result.books
        });
        
    }
    catch(error) {
        res.status(500).json({
            message : error.message
        });
    }
    
}

exports.deleteFromCart = async (req, res, next) => {
    try {
        const book_id = mongoose.Types.ObjectId(req.body.book_id);
        const user_id = mongoose.Types.ObjectId(req.body.user_id);

        const result = await Cart.findOne({user_id: user_id}).exec();

        const booksList = result.books;

        const cur_book_id = booksList.find((book) => {
            if(book_id.equals(book.product)){
                return book_id;
            }
        })

        if(!cur_book_id) {
            throw new Error("Book not in cart");
        }

        else {
            const book = await Book.findById(book_id);

            if(cur_book_id.quantity == 1) {
                const newBooksList = booksList.filter(function(book) { 
                    return !(book_id.equals(book.product));
                });

                result.books = newBooksList;
                const newTotal = result.total - book.price;
                result.total = newTotal;
            }

            else{
                const newQuantity = cur_book_id.quantity - 1;
                const newTotal = result.total - book.price;

                result.books.map((book) => {
                    if(book_id.equals(book.product)){
                        book.quantity = newQuantity;
                    }
                });

                result.total = newTotal;
            }

            await Cart.findOneAndUpdate({user_id: user_id}, result).exec();
            res.status(200).json({
                message: "Book deleted",
                total: result.total,
                cart: result.books
            });
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
}

