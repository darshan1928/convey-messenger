
const User = require("../models/userModels");
const { generateToken } = require("../config/generateToken");
const { hashPassword, comparePassword } = require("../config/hashPAssword");
const bcryptjs = require("bcryptjs");



//api/user/ - post
const registerUser = async (req, res) => {
    const { email, password, name, pic } = req.body;



  try {
      if (!name || !email || !password) {
          res.status(400).json({ errorCode: 1, message: "Please Enter All Fields" });
          return;
      }
      const userExist = await User.findOne({ email });
      if (userExist) {
          res.status(400).json({ errorCode: 2, message: "User Already Exist" });
          return;
      }
      const hashedPassword = await hashPassword(password);
       const picValue = pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
      const user = await User.create({ name, email, password: hashedPassword ,pic: picValue});
     
      const token =  generateToken(user._id);
     
    
      res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token
          
      });
  } catch (error) {
   
      console.log("error==", error.message);
  }


  
}
// api/user/login - post
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ errorCode: 3, message: "wrong credential" });
            return;
        }

        const hashedPassword = await comparePassword(password, user.password);

        if (!hashedPassword) {
            res.status(400).json({ errorCode: 4, message: "wrong credential" });
            return;
        }
        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;
         const token = generateToken(user._id);
       
        res.status(200).json({...userWithoutPassword,token});
    } catch (error) {
        console.log("error=", error.message);
    }
};

// query || api/user -get
const allUsers = async(req,res)=>{
  
const keyword = req.query.search?{
    $or:[
        {name:{$regex:req.query.search,$options:"i"}},
        {email:{$regex:req.query.search,$options:"i"}},

    ]
}:{}
// all users except login user
const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
res.send(users)
}

module.exports = { registerUser, authUser, allUsers };
