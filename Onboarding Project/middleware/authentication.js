const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
    
        //console.log(token);
        const decoded = jwt.verify(token, "secret key");

        console.log(decoded);
        const user = User.findById(decoded.userId);
        
        //console.log(user);

        if(!user) { 
            throw new Error("Auth Failed");
        }

        else{
            req.headers.userData = decoded; 
            next();
        }
    }
    catch(error) {
        res.status(401).json({
            message: error.message
        })
    }
}