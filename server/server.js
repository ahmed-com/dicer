const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,'/../public');
const port =process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const Game = require('./Game')(io);

app.use(express.static(publicPath));
io.on('connection',socket =>{
    socket.on('join',({name,room},ack)=>{
        socket.join(room);
        const error = Game.join({room,name,socket});
        if (error) return ack(error);
    })
});

server.listen(port,()=>{
    console.log(`server is up at port ${port}`)
});