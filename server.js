const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config();

// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     secure: false,
//     auth: {
//         user: process.env.mail,
//         pass: process.env.password,
//     }
// })

// console.log(process.env.mail);
// console.log(process.env.password);



// app.get('/test',(req,res)=>{
//     const mailOptions = {
//         from: process.env.mail,
//         to: 'abhisamudrala21@gmail.com',
//         subject: 'Testing Nodemailer',
//         text: 'Tinnava'
//     };


//     transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//             console.error('Error:', error);
//             if (error.code === 'EAUTH') {
//               // Handle authentication error
//               res.status(401).send(error);
//             } else {
//               // Handle other errors
//               res.status(500).send('Failed to send email');
//             }
//           } else {
//             console.log('Email sent:', info.response);
//             res.render('test',{msg: 'tinnava nanna'});
//           }
//     });

    
// })
  

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
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

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

    socket.on('chessMove',(oldCords,newCords)=>{
        console.log(oldCords,newCords)
        if(roomId){
            socket.to(roomId).emit('opMove',oldCords,newCords);
        }
    })
})





app.get('*', checkUser);

app.get('/',(req,res)=>{
    const token = req.cookies.jwt;
    if(token) res.redirect('games')
    else res.render('index',{title: "JOJO"});
})

app.get('/games' , requireAuth , (req,res) => { res.render('games')});
app.use(authRoutes);
app.use(gameRoutes);



