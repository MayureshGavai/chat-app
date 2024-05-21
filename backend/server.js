import express from "express";
import morgan from "morgan";
import cors from "cors";
import { configDotenv } from "dotenv";
import http from "http";
import { Server as SocketServer } from "socket.io";
import connectDB from "./src/config/dbConfig.js";
import userRoutes from "./src/routes/user.route.js";
import chatRoutes from "./src/routes/chat.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { errorHandler, notFound } from "./src/middleware/error.middleware.js";

// Load environment variables and connect to DB
configDotenv();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://chat-app-three-brown.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Error handling middleware
// app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send('server is running');
});

const server = http.createServer(app);

const io = new SocketServer(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL, // Allow your frontend URL
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
    console.log("User joined room:", room);
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("Chat users are not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
