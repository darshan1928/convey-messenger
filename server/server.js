const express = require("express");
const dbConnect = require("./db/db.js");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require('./routes/chatRoutes.js')
dotenv.config();
const PORT = process.env.PORT || 8887;
app.use(cors())
app.use(express.json());
dbConnect();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use('*',(req,res)=>{
res.json({errorCode:"5",message:"Wrong url"})
})

app.listen(PORT, () => console.log(`Server running @${PORT}`.yellow.bold));
