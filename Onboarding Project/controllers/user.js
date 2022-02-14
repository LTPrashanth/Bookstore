const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utility = require('../utility/utility')

const User = require('../models/user');
const Book = require('../models/books');
const Order = require('../models/orders');
const Cart = require('../models/cart');
const user = require('../models/user');
const { type } = require('express/lib/response');

exports.postSignup = async (req, res, next) => {
    try {
        const oldUser = await User.findOne({email: req.body.email});

        if(oldUser){
            throw new Error("Email already registered");
        }

        else{

            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if(err) {
                    res.status(500).json(err);
                }
                else {
                    const email = req.body.email;
                    const name = req.body.name;
                    const phone = req.body.phone;
                    const type = "User";
                    const status = "Active";

                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: name,
                        email: email,
                        password: hash,
                        phone: phone,
                        type: type,
                        status: status
                    });
                    
                    const token = jwt.sign({
                        name: name,
                        email: email,
                        userId: user._id,
                        type: type,
                        status: status,
                        phone: phone
                    }, 
                    "secret key",
                    {
                        expiresIn: "24h"

                    });

                    await user.save();

                    res.status(200).json({
                        message: "User created",
                        jwtToken: token
                    })
                }
            
            });
        }
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }

    
};

exports.postLogin = async (req, res, next) => {
    try{
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            throw new Error("Auth failed")
        }
        else {
            bcrypt.compare(req.body.password, user.password, async (err, result) =>{
                if(err) {
                    throw new Error("Auth failed");
                }
                if(result) {
                    const cart = await Cart.findOne({user_id: user._id});

                    if(!cart) {
                        const newCart = new Cart({
                            _id: new mongoose.Types.ObjectId(),
                            user_id: user._id,
                            total: 0,
                            books: [],
                            status: "OPEN"
                        });

                        console.log(newCart);
                        await newCart.save();
                    }

                    const token = jwt.sign({
                        //evrything except password
                        name: user.name,
                        email: user.email,
                        userId: user._id,
                        type: user.type,
                        status: user.status,
                        phone: user.phone
                    }, 
                    "secret key",
                    {
                        expiresIn: "2h"

                    });

                    res.status(200).json({
                        message: "Auth successful",
                        jwtToken: token
                    })
                }
                else{
                    res.status(401).json({
                        message: "Auth failed"
                    })
                }
            })
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        }); 
    }
};

