const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userController')
const {protect} = require("../middleware/authMiddleware.js");
const router= express.Router()


router.post('/',registerUser)
router.get('/',protect,allUsers)
router.post('/login',authUser)


module.exports = router