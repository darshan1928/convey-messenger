const express = require("express");
const dbConnect = require("./db/db.js");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require('./routes/chatRoutes.js')
const messageRoutes = require("./routes/messageRoutes.js");
dotenv.config();
const PORT = process.env.PORT || 8887;
app.use(cors())
app.use(express.json());
dbConnect();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
// messsage for 1to1 adn group chats
app.use("/api/message", messageRoutes);


app.use('*',(req,res)=>{
res.json({errorCode:"5",message:"Wrong url"})
})

const server = app.listen(PORT, () => console.log(`Server running @${PORT}`.yellow.bold));
