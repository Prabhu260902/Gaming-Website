require('dotenv').config();
const {User} = require("../models/user");
const jwtt = require('jsonwebtoken');
const Code = process.env.SecretCode;

function handleErrors(err){
    const error = {email: '', username: '', password: ''}

    if(err.message === 'Email Not Matched'){
        error.email = 'Email Not Matched';
    }

    if(err.message === 'Password Not Matched'){
        error.password = 'Password Not Matched';
    }

    if(err.code == 11000){
        error.email = "Email is already registered";
        return error;
    }
    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path] = properties.message;
        });
    }

    return error;  
}



function getUser(req, callback){
    const token = req.cookies.jwt;
    if(token){
        jwtt.verify(token, Code , async (err, decodedToken) => {
            if(decodedToken) {
                const user = await User.findById(decodedToken.id);
                callback(null,user)
            }
        })
    }
}

maxAge = 24 * 60 * 60;
const CreateToken = (id)=>{
    return jwtt.sign({ id },Code , {expiresIn: maxAge})
}


function generateRandomCode() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}






module.exports = {handleErrors,getUser,generateRandomCode,CreateToken};