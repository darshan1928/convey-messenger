const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { allMessages, sendMessage } = require("../controllers/messageControllers")

const router = express.Router()
router.post('/',protect,sendMessage)
router.get("/:chatId", protect, allMessages);

module.exports = router