const { Router } = require("express");
const router = Router();
const {User} = require('../models/user')
const Score = require('../models/score')
require('dotenv').config();
const {handleErrors,getUser, generateRandomCode, CreateToken} = require('./helper');
const fs = require('fs')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.mail,
        pass: process.env.password,
    }
})



const {S3Client,GetObjectCommand, ListObjectVersionsCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {Upload} = require('@aws-sdk/lib-storage');


const path = require('path');
const multer = require('multer');
const s3Client=new S3Client({
    credentials:{
        accessKeyId:process.env.Access_key,
        secretAccessKey:process.env.Secret_Access_key
    },
    region:'us-east-1'
});






const Code = process.env.SecretCode;
maxAge = 24 * 60 * 60;




exports.Getregister = (req,res)=>{
    const token = req.cookies.jwt;
    if(token) res.status(200).redirect('games');
    else res.status(200).render("register");
};

exports.Getlogin = (req,res)=>{
    const token = req.cookies.jwt;
    if(token) res.status(200).redirect('games');
    else res.status(200).render("login")
};


exports.Postregister = async (req,res)=>{
    const {email,username,password,val} = req.body;
    try{
        if(val){
            const otp = generateRandomCode();
            const mailOptions = {
                from: process.env.mail,
                to: email,
                subject: 'JOJO GAMES EMAIL VERFICATION',
                html: `
                <h1>Hello!</h1>
                <p>Your OTP for registration is: <strong>${otp}</strong></p>
                <p>Please use this OTP to complete your registration.</p>
                <p>If you didn't request this OTP, you can safely ignore this email.</p>
              ` 
            };
        
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    if (error.code === 'EAUTH') {
                    res.status(401).send(error);
                    } else {
                    res.status(500).send('Failed to send email');
                    }
                } else {
                    res.status(201).json({otp:otp});
                }
            });
        }
        
        else{
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password,salt);
            const user = await User.create({email,username,password : hashedPassword});
            
            let data = {
                email,
                'sudokuTime': {},
                'BlockScore': 0,
                'TicTacToe': {},
                'Snake': 0,
                'Chess': {},
                'TotalScore': 0,
            }
            
            const newUser = await Score.create(data);
            // newUser.save();
            const token = CreateToken(user._id);
            
            res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
            
            const imageName = `${email}`;
            const imagePath = path.join(__dirname,'..', 'public', 'images', 'icon.png');
            
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        error: 'Error reading static image file'
                    });
                }
                else{
                    new Upload({
                        client: s3Client,
                        params: {
                            Bucket: 'prabhukondru',
                            Key: imageName,
                            Body: data,
                            ContentType: 'image/jpeg'
                        }
                    }).done()
                        .then(data => {
                            res.status(201).json({user: user._id}); 
                        })
                        .catch(err => {
                        });
                    }
                
            });   
        }        
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}



exports.Postlogin = async (req,res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.login(email,password);
        const token = CreateToken(user._id);        
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
        if(user){
            const mailOptions = {
                from: process.env.mail,
                to: email,
                subject: 'WELCOME TO JOJO GAMES',
                html: 
                `<p>
                    <strong>YOU JUST LOGGED IN TO JOJO GAMES...</strong> 😊<br>
                    <em>TAKE A SMALL BREAK LET YOUR STRESS STRAIN SOMETIME</em> 💆‍♂️💆‍♀️
                </p>`
            };
        
        
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    if (error.code === 'EAUTH') {
                      res.status(401).send(error);
                    } else {
                      res.status(500).send('Failed to send email');
                    }
                } else {
                    res.status(201).json({user: user._id});
                }
            });
            
        }
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}


exports.Getprofile = async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const User = await Score.findOne({email:user.email});
            res.render('profile', {data : JSON.stringify(User) , USER : JSON.stringify(user)})
        }
    });
}

exports.Postprofile = async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const User = await Score.findOne({email:user.email});
            res.status(200).json(User);
        }
    });
}

exports.Postgetdata = async (req,res)=>{
    const Data = await Score.find().sort({TotalScore: -1});
    res.status(200).json(Data);
}

exports.Gettempprofile = async (req,res)=>{
    const email = req.query.email;
    const user = await Score.findOne({email});
    const name = await User.findOne({email});
    res.render('tempProfile', {data : JSON.stringify(user), name : JSON.stringify(name)})
}


exports.PostgetProfileLogo = async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const getObjectParams = {
                Bucket: "prabhukondru",
                Key: `${user.email}`,
            };        
            const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams));
            res.status(200).send({signedUrl});
        }
    });
}


exports.Postupload = (req, res) => {
    getUser(req, async (err,user)=>{
        if (err) {
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            if(!req.file || !req.file.buffer){
                res.send({
                    success:false,
                    error:'Invalid file'
                })
            }
        
            
            new Upload({
                client:s3Client,
                params:{
                    Bucket:'prabhukondru',
                    Key:`${user.email}`,
                    Body:req.file.buffer,
                    ContentType:req.file.mimetype,
                }
            }).done()
            .then(data=>{
                res.redirect('/games');
            })
            .catch(err=>{
                res.send({
                    success:false,
                    ...err
                })
            })
        }
    })
}


exports.Getlogout = (req,res) => {
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/')
}

exports.Getchangeprofile = (req,res)=>{
    res.render('changeProfile');
}


exports.GetleaderBoard = (req,res)=>{
    res.render('leaderBoard');
}
