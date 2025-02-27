const User = require("../models/userModel");
const main = require("../mail/transporter");
const sendmail = async(req,res) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).send({message: "Please provide email"});
    }
    try{
         const user = await User.findOne({email});
         if(!user){
            return res.status(400).send({message: "User not found please signup first!!"})
         }
            const info = await main(email, user.id);
            res.status(200).json({
        success: true,
        message: "Email sent",
        data: info,
      }); 

    }
    catch(e){
       console.log(e);
    return res.status(500).json({
            success: false,
            message: error.message || "Error sending email"
        });

    }
}
module.exports = sendmail;
