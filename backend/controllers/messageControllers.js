const asyncHandler = require("express-async-handler");
const Message = require('../models/messagemodel');
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const uploadDir = 'uploads/';
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true});
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
     if(file.mimetype.startsWith('image/')){
        cb(null, true);
     }
     else{
       cb(new Error('Not an image! Please upload only images.'), false);
  
     }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5 * 1024 * 1024}
});
const uploadImage = upload.single('image');

// Function to handle image upload middleware and errors
const handleImageUpload = (req, res, next) => {
  uploadImage(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      res.status(400);
      throw new Error(`Upload error: ${err.message}`);
    } else if (err) {
      // An unknown error occurred
      res.status(400);
      throw new Error(err.message);
    }
    // Everything went fine, proceed
    next();
  });
};


const sendMessage = asyncHandler(async(req,res) => {
     const {content, chatId} = req.body;

     if(!chatId){
        res.status(400);
    throw new Error("Chat ID is required");

     }
      if (!content && !req.file) {
    res.status(400);
    throw new Error("Message must have text or image");
  }
  let imageUrl = null;
  if(req.file){
    try{
    console.log("File details:", req.file);
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log("Generated image URL:", imageUrl);
     } catch(error){
     console.error("Error with file:", error);
  }}
  else {
  console.log("No file uploaded");
}


  try{
     var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        image: imageUrl
     };
     console.log("Message object before saving:", newMessage);
        var message = await Message.create(newMessage);

        message = await message.populate("sender" , "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });
        res.json(message);
     } catch(error){
         res.status(400);
         throw new Error(error.message);
     }
});
const allMessages = asyncHandler(async(req,res) => {
    try{
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", "name pic email")
        .populate("chat");
         const imagesInChat = messages.filter(m => m.image);
        console.log("Images in this chat:", imagesInChat.map(m => ({
          id: m._id, 
          imageUrl: m.image
        })));
        res.json(messages);
    }
    catch(error){
        res.status(400);
        throw new Error(error.message);
    }
})
module.exports = { sendMessage, allMessages, handleImageUpload};