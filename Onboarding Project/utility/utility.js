const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const User = require('../models/user');
const Book = require('../models/books');
const Order = require('../models/orders');

exports.getBooks = async(req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Book.find({ stock: { $gte: 1} } )//filter for stock > 0
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Book.find({ stock: { $gte: 1} } )
        .select('title author price _id stock imageUrl')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts: posts,
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

exports.getBookById = async(req, res, next) => {
    try{
        const id = req.params.bookId;
        
        const book = await Book.findById(id).select('title author price stock');

        if(!book){
            throw new Error("book does not exist");
        }
        else{
            res.status(200).json(book);
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
    
}