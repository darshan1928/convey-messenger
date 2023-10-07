const express = require("express")
const dbConnect =require("./db/db.js")
const app = express()

const dotenv = require("dotenv")
const PORT = process.env.PORT || 8887
dotenv.config()

app.use(express.json())
dbConnect()

app.get("/",(req,res)=>{
res.json({
    message:"its working"
})
})

app.listen(PORT,()=>console.log(`Server running @${PORT}`))