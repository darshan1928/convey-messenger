const db = require("mongoose")

const dbConnect=async()=>{
    
try {
    
    const {connection}= await db.connect(process.env.ATLES_URI)
    console.log(`mongo db established @ ${connection.host}`);
    
    } catch (error) {
        console.log("mongo db establishment failed==",error.message);
    }
}


module.exports = dbConnect