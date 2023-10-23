const jwt = require("jsonwebtoken");
const User = require("../models/userModels.js");
// *

const protect = async (req, res, next) => {
    let token;
    try {

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
         
            try {
              
                token = req.headers.authorization.split(" ")[1];
            
                //decoded token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
              
              
                req.user = await User.findById(decoded.id).select("-password");
            
                next();
            } catch (err) {
                console.log("err====", err.message);
                res.status(401)
                throw new Error("Not authorized, token failed")
            }
        }
        if (!token){res.status(401);
            throw new Error("Not Authorized,no token")}
    } catch (err) {
        console.log("inside auth middleware")
        console.log("err===", err.message);
    }
};

module.exports = { protect };
