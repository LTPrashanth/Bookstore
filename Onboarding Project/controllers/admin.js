const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },

    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const upload = multer({storage: storage});

const User = require('../models/user');
const Book = require('../models/books');
const Order = require('../models/orders');
const utility = require('../utility/utility')

exports.getBooks = async (req, res, next) => {
    await utility.getBooks(req, res, next);
};

exports.getBookById = async (req, res, next) => {
    await utility.getBookById(req, res, next)
};

exports.patchBookById = (req, res, next) => {

    //find and update
    const id = req.params.bookId;
    const filter = {_id : id}
    const update = {stock : req.body.stock}
    console.log(update)

    Book.findByIdAndUpdate(id, update)
    .exec()
    .then(result => {
        res.status(200).json({
            message: "updated"
        })
    })
    .catch(err => {
        res.status(500).json(err)
    })
    
};

exports.deleteBookById = async (req, res, next) => {
    try{
        const id = req.params.bookId;
    
        const book = await Book.findById(id);

        if(!book) {
            throw new Error("Book does not exist");
        }
        else{
            await Book.findByIdAndDelete(id);

            res.status(200).json({
                message: "Book deleted"
            })
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.postAddBook = (req, res, next) => {

    const title = req.body.title;
    const author = req.body.author;
    const price = req.body.price;
    const stock = req.body.stock;
    let status;

    if(stock > 0){
        status = "Active";
    }
    else{
        status = "Inactive";
    }
    
    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: title,
        author: author,
        status: status,
        price: price,
        stock: stock,
        imageUrl: req.file.path
    });

    console.log(book);

    book
    .save()
    .then(result => {
        console.log("created");
        res.status(201).json({
            message : "Added Book"
        })
    })
    .catch(error => {
        res.status(500).json({
            message : error.message
        })
    });
};

exports.getOrders = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    
    Order.find()//filter for stock > 0
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Order.find()
        .select('user_id books total payment status')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
        res.status(200).json({
            message: 'Fetched orders successfully.',
            orders: posts,
            totalItems: totalItems
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.patchCompleteOrder = async (req, res, next) => {
    try{
        const orderId = req.params.orderId;

        const update = {status: "COMPLETED"};
        const filter = {_id: orderId};

        const order = await Order.findById(orderId);

        if(order.status != "PROCESSING" || order.payment != "COMPLETED"){
            throw new Error("Order cant be completed");
        }

        else{
            await Order.findByIdAndUpdate(filter, update);

            res.status(200).json({
                message: "Order completed",
                orderId: orderId
            })
        }
        
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
    
}



