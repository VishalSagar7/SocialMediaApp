import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ['GET', 'POST']
    }
});

const userSocketMap = {}; // Stores userId -> socketId mappings

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        // Add userId and socketId to the map
        userSocketMap[userId] = socket.id;
        // console.log(`User connected: userId=${userId}, socketId=${socket.id}`);
        // console.log("userSocketMap:", userSocketMap);
    }

    // Emit online users list to all connected clients
    // io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        // Remove user from the map on disconnjjjjjj
        if (userId) {
            // console.log(`User disconnected: userId=${userId}, socketId=${socket.id}`);
            delete userSocketMap[userId];
        }

        // Update the online users list
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});


export { app, server, io };


