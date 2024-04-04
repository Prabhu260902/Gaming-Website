const Score = require('../models/score')
const {getUser} = require('../controllers/helper');

exports.Getsudoku = (req,res) => {
    res.status(200).render('sudoku');
}

exports.Getgames = (req,res) => { res.render('games')};

exports.GetIndex = (req,res)=>{
    const token = req.cookies.jwt;
    if(token) res.redirect('games')
    else res.render('index',{title: "JOJO"});
}

exports.Postsudoku = async (req,res) => {
    getUser(req, async (err, user) => {
        if (err) {
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const { sudokuTime,level } = req.body;
            const USER = await Score.update(user.email,sudokuTime,level);
        }
    });   
}


exports.Getblock = (req,res) => {
    res.status(200).render('block');
}


exports.Postblock = async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const { score } = req.body;
            const USER = await Score.updateBlock(user.email,score);
        }
    });
}


exports.Gettictactoe = (req,res)=>{
    res.status(200).render('tic_tac_toe');
}


exports.Posttictactoe = async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const { win } = req.body;
            const USER = await Score.updateTicTacToe(user.email, win);
        }
    });
}


exports.Getsnake = (req,res)=>{
    res.status(200).render('snake')
}
exports.Postsnake = async (req,res)=>{
    getUser(req, async (err,user)=>{
        if(err){
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' });
        } else {
            const { score } = req.body;
            const USER = await Score.updateSnake(user.email, score);
        }
    })
}


exports.Getchess = (req,res)=>{
    res.status(200).render('chess');
}
exports.Postchess = async (req,res)=>{
    getUser(req, async (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' }); // Handle errors
        } else {
            const { win } = req.body;
            const USER = await Score.updateChess(user.email, win);
        }
    });
}


