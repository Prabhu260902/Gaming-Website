require('dotenv').config();
const User = require("../models/user");
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

function shiftCharacters(str) {
    let shiftedString = "";
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        let shiftedCharCode = charCode + 3;
        shiftedString += String.fromCharCode(shiftedCharCode);
    }
    return shiftedString;
}

function shiftCharactersDecrypt(str) {
    let shiftedString = "";
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        let shiftedCharCode = charCode - 3;
        shiftedString += String.fromCharCode(shiftedCharCode);
    }
    return shiftedString;
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

module.exports = {handleErrors,shiftCharacters,shiftCharactersDecrypt,getUser};