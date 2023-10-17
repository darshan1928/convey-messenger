const db = require("mongoose")

const dbConnect=async()=>{
    
try {
    
    const {connection}= await db.connect(process.env.ATLES_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    console.log(`mongo db established @ ${connection.host}`.cyan.underline);
    
    } catch (error) {
        console.log("mongo db establishment failed==",error.message);
    }
}


module.exports = dbConnect