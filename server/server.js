const express = require("express");
const dbConnect = require("./db/db.js");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
dotenv.config();
const PORT = process.env.PORT || 8887;
app.use(cors());
app.use(express.json());
dbConnect();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
// messsage for 1to1 adn group chats
app.use("/api/message", messageRoutes);

app.use("*", (req, res) => {
    res.json({ errorCode: "5", message: "Wrong url" });
});

const server = app.listen(PORT, () => console.log(`Server running @${PORT}`.yellow.bold));
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
        methods: ["GET", "POST"], // Define the HTTP methods you want to allow
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);

        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room ==", room);
    });
    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", (room) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
