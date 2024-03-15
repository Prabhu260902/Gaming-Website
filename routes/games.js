const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { requireAuth } = require("../middleware/authMiddleware");
const Score = require('../models/score');
const {handleErrors,shiftCharacters,shiftCharactersDecrypt,getUser} = require('../controllers/helper');
const { json } = require("body-parser");
require("dotenv").config();



router.get("/sudoku", requireAuth , (req,res)=>{
    res.render('sudoku')
})

router.get("/block",requireAuth , (req,res)=> {
    res.render('block')
})

router.get("/tictactoe",requireAuth, (req,res)=>{
    res.render('tic_tac_toe');
})

router.get('/snake',requireAuth,(req,res)=>{
    res.render('snake')
})

router.get('/chess',requireAuth,(req,res)=>{
    res.render('chess');
})


router.post('/tictactoe',requireAuth , async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const { win } = req.body;
            const USER = await Score.updateTicTacToe(user.email, win);
        }
    });
});

router.post('/snake',requireAuth,async (req,res)=>{
    getUser(req, async (err,user)=>{
        if(err){
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' });
        } else {
            const { score } = req.body;
            const USER = await Score.updateSnake(user.email, score);
        }
    })
})

router.post("/sudoku",requireAuth,async (req,res) => {
    getUser(req, async (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const { sudokuTime,level } = req.body;
            const USER = await Score.update(user.email,sudokuTime,level);
        }
    });
    
})


router.post("/block",requireAuth,async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const { score } = req.body;
            const USER = await Score.updateBlock(user.email,score);
        }
    });
})


module.exports = router;