const express = require("express");
const dotenv = require("dotenv");
// const {chats} = require("./data/data");
const connectDB = require("./config/db")
const colors = require("colors");
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes"); 
const messageRoutes = require("./routes/messageRoutes"); 
const sendmail = require("./controllers/sendmail.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.get('/', (req,res) => {
//          res.send("API is running");
//       });

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
console.log("directory", path.join(__dirname, 'uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/send-mail',sendmail);

//.....deployment
 const  _dirname1 = path.resolve();
 if(process.env.NODE_ENV === "production"){
   app.use(express.static(path.join(_dirname1, "/frontend/build")));

  app.get('*',(req , res) => {
      res.sendFile(path.resolve(_dirname1, "frontend","build","index.html"));
  })

 }else{
   app.get('/', (req,res) => {
     res.send("API is running successfully");
   });
}
//...deployment

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,
   console.log(`Server started on PORT ${PORT}...`.yellow.bold)
);

const io = require("socket.io")(
   server, {
      pingTimeout: 60000,
      cors: {
         origin: "http://localhost:3000",

      }
   }
);

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
    socket.on("join chat" , (room) => {
      socket.join(room);
      console.log("User joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;
      console.log(newMessageReceived);
      console.log(chat);
      if(!chat.users) 
      return console.log("chat.users not defined");

      // if (!chat.users) {
      //    return console.log("chat or chat.users not defined");
      //  }

      chat.users.forEach((user) => {
         if(user._id == newMessageReceived.sender._id) return;
         socket.in(user._id).emit("message received", newMessageReceived)
      });
    });
   // socket.on("new message", (newMessageReceived) => {
   //    if (!newMessageReceived.chat || !newMessageReceived.chat.users) {
   //      console.log("chat or chat.users not defined");
   //      return;
   //    }
    
   //    const chatUsers = newMessageReceived.chat.users;
   //    const senderId = newMessageReceived.sender._id;
    
   //    chatUsers.forEach((user) => {
   //      if (user._id !== senderId) {
   //        socket.in(user._id).emit("message received", newMessageReceived);
   //      }
   //    });
   //  });

    socket.off("setup" ,() => {
      console.log("User Disconnected");
      socket.leave(userData._id);
    })
});
