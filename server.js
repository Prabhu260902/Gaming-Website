const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config();


const {Server} = require("socket.io");
const io = new Server(server);

const path = require('path');
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const gameRoutes = require('./routes/games')
const {requireAuth,checkUser}  = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
require('dotenv').config();



const port = process.env.PORT;


app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);
    next();
});



app.set("view engine",'ejs');
app.use("/static",express.static(path.join(__dirname,'public')));
app.use(cookieParser())
app.use(express.json());


const dbURI = process.env.URI
mongoose.connect(dbURI)
    .then((result)=>{
        console.log("MongoDB Connected")
        server.listen(port,()=>{
            console.log('http://localhost:3000')
        })
    })
    .catch((err) => console.log(err));


io.on('connection',(socket)=>{
    let roomId = null;

    socket.on('room', (id) => {
        if (roomId) {
            socket.leave(roomId);
        }
        roomId = id;
        socket.join(roomId);
        socket.to(roomId).emit('reset',roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('reset',(id)=>{
        socket.to(roomId).emit('reset',roomId);
    })

    socket.on('chat-message', (msg) => {
        socket.broadcast.emit('')
        if (roomId) {
            socket.to(roomId).emit('message', msg);
            console.log(`Message sent to room ${roomId}: ${msg}`);
        } else {
            console.error('Socket is not in any room');
        }
    });

    socket.on('disconnect', () => {
        if (roomId) {
            socket.leave(roomId);
            roomId = null;
            console.log(`Socket ${socket.id} left room ${roomId}`);
        }
    });


    socket.on('move', (cords,cnt) => {
        if (roomId) {
            socket.to(roomId).emit('nextMove', cords,cnt);
        }
    })

    socket.on('win',(id)=>{
        if (roomId) {
            socket.to(roomId).emit('wins', id);
        }
    })

    socket.on('chessMove',(oldCords,newCords,p)=>{
        if(roomId){
            socket.to(roomId).emit('opMove',oldCords,newCords,p);
        }
    })

    socket.on('pawnPromotion',(place,img,ele)=>{
        if(roomId){
            socket.to(roomId).emit('PawnPromotion',place,img,ele);
        }
    })

    socket.on('castling',(New,img,old,val)=>{
        if(roomId){
            socket.to(roomId).emit('Castling',New,img,old,val);
        }
    })
})





app.get('*', checkUser);

app.get('/',(req,res)=>{
    const token = req.cookies.jwt;
    if(token) res.redirect('games')
    else res.render('index',{title: "JOJO"});
})


app.post('/test',(req,res)=>{
    res.json('test');
})

app.get('/games' , requireAuth , (req,res) => { res.render('games')});
app.use(authRoutes);
app.use(gameRoutes);



