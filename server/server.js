const express = require("express")

const app = express()

const dotenv = require("dotenv")
const PORT = process.env.PORT || 8887
dotenv.config()
app.get("/",(req,res)=>{
res.json({
    message:"its working"
})
})

app.listen(PORT,()=>console.log(`Server running @${PORT}`))