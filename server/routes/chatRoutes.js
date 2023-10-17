const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { accessChat, createGroupChat, renameGroup, addToGroup, removeFromGroup, fetchChat } = require("../controllers/chatControllers")

const router = express.Router()


router.post('/',protect,accessChat)
router.get('/',protect,fetchChat)
router.post('/group',protect,createGroupChat)
router.put('/rename',protect,renameGroup)
router.put('/groupremove',protect,removeFromGroup)
router.put('/addgroup',protect,addToGroup)


module.exports=router