const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgrid({
   auth : {
      api_key : process.env.API_KEY 
   }
}))

const allUsers = asyncHandler(async(req,res) => {
    const keyword = req.query.search
    ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i"}},
            { email: { $regex: req.query.search, $options: "i"}},
        ], 
    }
    : {};
    const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
    res.send(users);
});
const registerUser = asyncHandler(async (req,res)=> {
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new error("Please enter all the fields");
    }

    const userExists = await User.findOne({ email });
    if(userExists){
    res.status(400);
    throw new Error("User already exists");
}
const user = await User.create({
    name,
    email,
    password,
    pic,
});
if(user){
// await transporter.sendMail({
//     to: user.email,
//     from : "no-reply@talk-a-tive.com",
//     subject: 'Welcome to Talk-a-tive!',
//     text: `Hi ${user.name},\n\nThank you for signing up for Talk-a-tive. We're excited to have you onboard!\n\nBest regards,\nTalk-a-tive Team`,
           
// });
    res.status(201).json({
            _id: user._id,
            name:user.name,
           email: user.email,
           pic: user.pic,
           token: generateToken(user._id),
    })
    
}
else{
    res.status(400);
    throw new Error("Failed to create the user");
}
});

const authUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name:user.name,
           email: user.email,
           pic: user.pic,
           token: generateToken(user._id),
        });
    }else{
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

    
});


module.exports = {allUsers,registerUser,authUser};
