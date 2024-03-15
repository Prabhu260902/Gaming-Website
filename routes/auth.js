const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { requireAuth } = require("../middleware/authMiddleware");
const Score = require('../models/score');
const {handleErrors,shiftCharacters,shiftCharactersDecrypt,getUser} = require('../controllers/helper');
const { json } = require("body-parser");
require("dotenv").config();



//handling error
const Code = process.env.SecretCode;

maxAge = 24 * 60 * 60; //max time in seconds for jwt token
//create token
const CreateToken = (id)=>{
    return jwt.sign({ id },Code , {expiresIn: maxAge})
}


router.get("/register",(req,res)=>{
    const token = req.cookies.jwt;
    if(token) res.redirect('games');
    else res.render("register");
})

router.get("/login",(req,res)=>{
    const token = req.cookies.jwt;
    if(token) res.redirect('games');
    else res.render("login")
})

router.post("/register",async (req,res)=>{
    const {email,username,password} = req.body;
    
    try{
        const user = await User.create({email,username,password});
        
        let data = {
            email,
            'sudokuTime': {},
            'BlockScore': 0,
            'TicTacToe': {},
            'Snake': 0,
        }
        const newUser = await Score.create(data);
        newUser.save();

        const token = CreateToken(user._id);
        let encryptedEmail = shiftCharacters(user.email);
        res.cookie('email',encryptedEmail,{maxAge:maxAge*1000,httpOnly:false});
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
})


router.post("/login",async (req,res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.login(email,password);
        const token = CreateToken(user._id);
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
        if(user){
            let encryptedEmail = shiftCharacters(user.email);
            res.cookie('email',encryptedEmail,{maxAge:maxAge*1000,httpOnly:false});
            res.status(201).json({user: user._id});
        }
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
})  


router.get("/logout", (req,res) => {
    res.cookie('jwt','',{maxAge: 1});
    res.cookie('email','',{maxAge:1});
    res.redirect('/')
})


router.get("/profile", requireAuth , async (req,res)=>{
    let decryptedEmail = shiftCharactersDecrypt(req.cookies.email);
    const user = await Score.findOne({email : decryptedEmail});
    res.render('profile', {data : JSON.stringify(user)})
})




router.post('/profile',requireAuth , async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const User = await Score.findOne({email:user.email});
            // console.log(User);
            res.status(200).json(User);
        }
    });
})


module.exports = router; 