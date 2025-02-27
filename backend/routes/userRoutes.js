const express = require('express');
const router = express.Router();
const { registerUser, sendmail, resetPassword } = require("../controllers/userControllers");
const { authUser} = require("../controllers/userControllers");
const { allUsers} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");
 router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser)
router.post('/send-mail',sendmail);
router.post('/reset-password/:token', resetPassword);

module.exports = router;