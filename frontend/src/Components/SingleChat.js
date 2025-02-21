import io from 'socket.io-client';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box,FormControl,IconButton,Spinner,Text,Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat.js';

//import {Lottie} from 'react-lottie';

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

  const [messages, setMessages] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
    const {user, selectedChat, setSelectedChat,notification,setNotification} = ChatState();
    const toast = useToast();
   
    const fetchMessages = async()=> {
      if(!selectedChat) return;
      try{
        const config = {
          baseURL: 'http://localhost:4000',
          headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`
          },
      };
      setLoading(true);
      const {data} = await axios.get(
        `/api/message/${selectedChat._id}`,config
      );
      // console.log(messages);
      setMessages(data)
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
      }catch(error){
        toast({
          title: "Error Occured",
          description: "Failed to Load message",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom",
      });
      
    }
    };
    // console.log(messages);
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
       socket.on("connected", () => setSocketConnected(true));
       socket.on("typing", () => setIsTyping(true));
       socket.on("stop typing", () => setIsTyping(false));
      //  return () => {
      //   // Clean up the socket connection when the component is unmounted
      //   socket.disconnect();
      // };
 // eslint-disable-next-line
  },[]);
  
    useEffect(()=> {
      fetchMessages();
      selectedChatCompare = selectedChat;
       // eslint-disable-next-line
    },[selectedChat]);

    

useEffect(() => {
  socket.on('message received',(newMessageRecieved) => {
    if(!selectedChatCompare || 
      selectedChatCompare._id  !== newMessageRecieved.chat._id){
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }}
        else{
          setMessages([...messages, newMessageRecieved])
        }
      
  });
});



    const sendMessage = async(event)=> {
     if(event.key === "Enter" && newMessage){
      socket.emit('stop typing', selectedChat._id);
              try{
                const config = {
                  baseURL: 'http://localhost:4000',
                  headers: {
                      "Content-type": "application/json",
                      Authorization: `Bearer ${user.token}`
                  },
              };
              setNewMessage("");
              const {data} = await axios.post("/api/message",
                { content: newMessage,
                chatId: selectedChat._id},
                config
            );
            console.log(data);
            socket.emit("new message", data);
            setMessages([...messages, data]);
              }
              catch(error){
                toast({
                  title: "Error Occured",
                  description: "Failed to send message",
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  position: "bottom",
              });
              
            }
              }
     
    };
   
    const typingHandler = (e)=> {
            setNewMessage(e.target.value);

            if(!socketConnected) return;
            if(!typing){
              setTyping(true);
              socket.emit('typing', selectedChat._id);
            }
            let lastTypingTime = new Date().getTime();
            var timerLength = 3000
            setTimeout(()=> {
              var timeNow = new Date().getTime();
              var timeDiff = timeNow - lastTypingTime;

              if(timeDiff >= timerLength && typing){
                socket.emit("stop typing" , selectedChat._id);
                setTyping(false);
              }
            }, timerLength);
    }
  return (
    <>
    {selectedChat ? (
      <>
      <Text   
      fontSize={{base: "28px", md: "30px"}}
      pb = {1}
      px={2}
      w="100"
      fontFamily="Work sans"
      display="flex"
      justifyContent={{base: "space-between"}}
      alignItems="center"
      >
        <IconButton
        display={{base: "flex", md: "none"}}
        icon={<ArrowBackIcon/>}
        onClick={()=> setSelectedChat("")}
        
        />
        {!selectedChat.isGroupChat ? (
            <>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
            </>
        ):(
            <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
            fetchMessages={fetchMessages}/>
            </>
        )}
      </Text>
<Box    
    display= "flex"
    flexDir="column"
    justifyContent="flex-end"
    p = {3}
    bg= "#E8E8E8"
    w="100%"
    h="92%"
    borderRadius="lg"
    overflowY= "hidden"
>
{loading ? (
  <Spinner
     size="xl"
     w={20}
     h = {20}
     alignSelf="center"
     margin="auto"
  
  />
) : (
  <div className='messages'>
   <ScrollableChat messages={messages}/>
  </div>
)}
<FormControl 
 onKeyDown={sendMessage}
isRequired mt={1}
>
  {isTyping ? <div>Typing..</div> : <></>}
  
<Input 
variant="filled"
bg = "#E0E0E0"
placeholder= "Enter a Message.."
onChange={typingHandler}
value = {newMessage}/>

</FormControl>
</Box>
      </>
    ):(
        <Box display="flex"
        alignItems="center"
        justifyContent= "center"
        h="100%"
        >
            <Text fontSize = "3xl" pb={3} fontFamily="Work sans">Click on a user to start chatting</Text>
        </Box>
    ) }
    </>
  );
}

export default SingleChat