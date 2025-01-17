import express, { json, urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import { app, server } from './socket/socket.js'
import path from 'path';

dotenv.config();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();


// middlewares 
app.use(cors({
    origin: process.env.URL,
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// apis

app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});



server.listen(PORT, () => {
    connectDb();
    console.log(`port started on ${PORT}`);
})


//aS2DILIDnZNRrXVO
//6aeDuqre36gvIqdo