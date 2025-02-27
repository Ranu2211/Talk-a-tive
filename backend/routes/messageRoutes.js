const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const {sendMessage,allMessages, handleImageUpload} = require('../controllers/messageControllers');

const router = express.Router()
router.route('/').post(protect, handleImageUpload, sendMessage);
router.route('/:chatId').get(protect, allMessages);
module.exports = router;
