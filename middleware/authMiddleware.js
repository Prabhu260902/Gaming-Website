const jwtt = require('jsonwebtoken');
const User = require("../models/user")
require('dotenv').config();

// console.log(jwt)
const Code = process.env.SecretCode;
const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwtt.verify(token, Code , (err, decodedToken) => {
            if(err){
                res.redirect('/login');
            } else {
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}


const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwtt.verify(token, Code , async (err, decodedToken) => {
            if(err){
                res.cookie('jwt','',{maxAge: 1});
                res.cookie('email','',{maxAge:1});
                res.redirect('/login');
            } else {
                const user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth , checkUser};

