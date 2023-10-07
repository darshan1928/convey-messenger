const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, trim: true },
    password: { type: String, require: true },
    pic: {
        type: String,
        require: true,
        default:
            "https://cdn.iconscout.com/icon/free/png-512/free-avatar-human-man-profile-auto-user-30483.png?f=webp&w=256",
    },
},{timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports = User;
