const Chat = require("../models/chatModel.js");
const User = require("../models/userModels");

const accessChat = async (req, res) => {
    const { userId } = req.body;
    const Chat = require("../models/chatModel.js");

    if (!userId) {
        console.log("userId params not send with params");
        return res.status(400);
    }

    // chat exist with this user
// one to one chat between login user and selected user
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }],
    })
        .populate("users", "-password")
        .populate("latestMessage");
    // .populate({path:"latestMessage",populate:{
    //     path:"sender",
    //     select:"name pic email"
    // }});

    //OR

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.send(400);
            throw new Error(error.message);
        }
    }
};

const fetchChat = async (req, res) => {
    try {
       
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                
                res.status(200).send(results);
            });
    } catch (error) {
        res.send(400);
        throw new Error(error.message);
    }
};

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        //user members and group name
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users); // parsing stringify into obj
    if (users.length < 2) {
        return res.status(400).send({ message: "More than 2 users to form a chat" });
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.send(400);
        throw new Error(error.message);
    }
};

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
         if (!updatedChat) {
             res.status(404);
             throw new Error("Chat Not Found");
         } else {
             res.json(updatedChat);
         }
};

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!added) {
        res.status(400);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).json(added);
    }
};

const removeFromGroup = async (req, res) => {
    const { userId, chatId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!removed) {
        res.status(400);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).json(removed);
    }
};

module.exports = { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup };
