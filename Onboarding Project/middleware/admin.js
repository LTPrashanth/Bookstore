const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    try{
        const userData = req.headers.userData;

        if(userData.type == "Admin"){
            next();
        }
        else{
            throw new Error("Auth Failed");
        }
    }
    catch(error) {
        res.status(401).json({
            message: error.message
        })
    }
}

