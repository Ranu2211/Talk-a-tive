const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const jwt = require("jsonwebtoken");

async function main(email, id) {
const token = jwt.sign({email}, process.env.JWT_SECRET, {
    expiresIn: "1h",
})
console.log("Email:", process.env.EMAIL);
console.log("Password:", process.env.PASSWORD ? "****" : "Not defined");

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: true
    }
    
});
try {
    await Transporter.verify();
    console.log('Transporter verification successful');
  } catch (error) {
    console.error('Transporter verification failed:', error);
    throw error;
  }
try {
    const info = await Transporter.sendMail({
      from: `"Talk-A-Tive" <${process.env.EMAIL}>`,
      to: email,
      subject: "Reset password link",
      text: `Click here to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      });
    
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
module.exports = main;