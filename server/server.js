const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const Game = require('./Game');

const publicPath = path.join(__dirname,'/../public');
const port =process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
io.on('connection',socket =>{
    socket.on('join',({name,room},ack)=>{
        const {error , game } = Game.join(room);
        if (error) return ack(error);

    })

    socket.on('disconnect',()=> {
        // on disconnection 
    });
});


server.listen(port,()=>{
    console.log(`server is up at port ${port}`)
});