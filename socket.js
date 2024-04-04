
const {Server} = require("socket.io");


function socketServer(server){
    const io = new Server(server);
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
}


module.exports = {socketServer}