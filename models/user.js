const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
require('dotenv').config()


function checkPassword(str){
    if((/[A-Z]/.test(str) || /[a-z]/.test(str)) && /[0-9]/.test(str) && /[~!@#$%^&*]/.test(str)) return true;
    else return false;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Please enter a valid email']
        
    },
    username: {
        type: String,
        required: [true,'Please enter the username'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true,'Please enter the password'],
        minlength: [6,'Minimum Password length should be 6'],
        validate: [checkPassword,'Password must contain Alphabet,Number and special Character'],
    },
});


userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error("Password Not Matched");
    }
    throw Error("Email Not Matched");
}


const User = mongoose.model('user',userSchema);

module.exports = {User,checkPassword};
