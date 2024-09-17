
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('index'); // assuming you're using ejs as your template engine
});

// Handle socket connections
io.on('connection', (socket) => {
    socket.on("send-location",function(data){
        io.emit("get-location",{id:socket.id, ...data})
    })

    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id)
    })
  console.log('A user connected');
  
  
});

// Start the server
server.listen(3030);
