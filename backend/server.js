import express from "express";
import morgan from "morgan";
import cors from "cors";
import { chats } from "./src/data/data.js";
import { configDotenv } from "dotenv";
import connectDB from "./src/config/dbConfig.js";
import userRoutes from "./src/routes/user.route.js";
import chatRoutes from "./src/routes/chat.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { errorHandler, notFound } from "./src/middleware/error.middleware.js";
import { Server as SocketServer } from "socket.io";
import http from "http";

configDotenv();
connectDB();
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// app.use(notFound())
// app.use(errorHandler())

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({ message: 'hello world' });
});

app.get("/api/chats", (req, res) => {
    res.status(200).json(chats);
});

app.get("/api/chats/:id", (req, res) => {
    const singleChatId = req.params.id;
    const findChat = chats.filter(chat => chat._id === singleChatId);
    res.status(200).json(findChat);
});

const server = http.createServer(app);

const io = new SocketServer(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173", // Allowing your frontend URL
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room : " + room);
    });

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat users are not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("User disconnected");
        socket.leave(userData._id)
    });

    
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
