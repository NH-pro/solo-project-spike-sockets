const express = require('express');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        socket.to()
    });

    // Like sagas, the server will listening for an event name called "send_message".
    socket.on("send_message", (data) => {
        console.log(data);
        // Server will emit its own event called "recieve_message" that is sending
        //  that is sending the original data ,{message: "hello"}, that one of the clients sent to the server.
        socket.to(data.room).emit("recieve_message", data)
    });
})

server.listen(3001, () => {
    console.log('Server is Running!');
});