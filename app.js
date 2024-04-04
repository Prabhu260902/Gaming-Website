const express = require('express')
const {createServer,Server} = require('http')
const app = express();
// const http = require('http');
const server = createServer(app);
require('dotenv').config();



const path = require('path');
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const gameRoutes = require('./routes/games')
const cookieParser = require('cookie-parser');
const { socketServer } = require('./socket');
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
const connection = ()=>{
    mongoose.connect(dbURI)
        .then(()=>{
            console.log("MongoDB Connected")
            server.listen(port,()=>{
                console.log(`http://localhost:${port}`)
            })
        })
        .catch((err) => {
            console.error(err.message)
        });
}

connection()



socketServer(server);



app.use(authRoutes);
app.use(gameRoutes);


module.exports = {app,connection,server}



