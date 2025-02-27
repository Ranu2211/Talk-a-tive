import io from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Spinner,
  Text,
  Input,
  useToast,
  Image,
  InputRightElement,
  InputGroup,
  Flex
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { MessageSquare } from "lucide-react";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat.js";
import { Image as ImageIcon, Send, X } from "lucide-react";

//import {Lottie} from 'react-lottie';

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const baseURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const fileInputRef = useRef(null);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
          headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${baseURL}/api/message/${selectedChat._id}`,
        config
      );
      // console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load message",
        status: "error",
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
    return () => {
      //   // Clean up the socket connection when the component is unmounted
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });

    return () => {
      socket.off("message received");
    };
    // eslint-disable-next-line
  }, [selectedChatCompare, notification, messages]);

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && (newMessage || imageFile)) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const formData = new FormData();
        formData.append("chatId", selectedChat._id);
        if (newMessage) formData.append("content", newMessage);
        if (imageFile) formData.append("image", imageFile);


        if (fileInputRef.current) fileInputRef.current.value = "";
        const { data } = await axios.post(
          `${baseURL}/api/message`,
          formData,
          {
            ...config,
            headers: {
              ...config.headers,
              "Content-Type": "multipart/form-data",
              content: newMessage, chatId: selectedChat._id
            },
          }

        );
        setNewMessage("");
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.response?.data?.message || "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      finally {
        setSendingMessage(false);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={1}
            px={2}
            w="100"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Box display="flex" alignItems="center" gap={3}>
                  <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                    <Image
                      borderRadius="full"
                      boxSize="30px"
                      src={getSenderFull(user, selectedChat.users).pic}
                      alt={getSenderFull(user, selectedChat.users).name}
                      cursor="pointer"
                    />
                  </ProfileModal>
                  <Text fontSize="lg" fontWeight="bold">
                    {getSender(user, selectedChat.users)}
                  </Text>
                </Box>
                <button onClick={() => setSelectedChat(null)}>
                  <X />
                </button>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="92%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {imagePreview && (
              <Flex mt={2} position="relative" width="150px">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  maxH="100px"
                  borderRadius="md"
                />
                <IconButton
                  icon={<X size={16} />}
                  size="xs"
                  colorScheme="red"
                  position="absolute"
                  top={-2}
                  right={-2}
                  borderRadius="full"
                  onClick={removeImage}
                  aria-label="Remove image"
                />
              </Flex>
            )}

            <FormControl mt={1}>
              {isTyping ? <Text fontSize="xs">Typing...</Text> : <></>}

              <InputGroup>
                <Input
                  type="text"
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a Message.."
                  onChange={typingHandler}
                  value={newMessage}
                  onKeyDown={sendMessage}
                  pr="4.5rem"
                  isDisabled={sendingMessage}
                // Add padding to the right for the icons
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}

                  //className="hidden"

                  onChange={handleImageChange}
                  style={{ display: "none" }}
                // value={newMessage}
                />

                <InputRightElement width="4.5rem" display="flex" gap={2}>
                  <IconButton
                    size="sm"
                    icon={<ImageIcon size={20} />}
                    variant="ghost"
                    //onClick={() => console.log("Image Upload Clicked")}
                    color={imagePreview ? "teal.500" : "gray.400"}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload Image"
                    isDisabled={sendingMessage}

                  />
                  <IconButton
                    size="sm"
                    icon={sendingMessage ? <Spinner size="sm" /> : <Send size={20} />}
                    variant="ghost"
                    color={newMessage.trim() || imagePreview ? "blue.500" : "gray.400"}
                    aria-label="Send Message"
                    onClick={sendMessage}
                    isDisabled={(!newMessage.trim() && !imagePreview) || sendingMessage}
                   />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          w="100%"
          p={8}
          bg="gray.100"
          flexDirection="column"
        >
          {/* Icon Display */}
          <Box display="flex" justifyContent="center" mb={4}>
            <Box
              w="64px"
              h="64px"
              bg="blue.100"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              animation="bounce 1.5s infinite"
            >
              <MessageSquare size={32} color="#3b82f6" />
            </Box>
          </Box>

          {/* Welcome Text */}
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Welcome to Talk-A-Tive!
          </Text>
          <Text fontSize="lg" color="gray.600" mb={6}>
            Select a conversation from the sidebar to start chatting
          </Text>

          {/* Existing Text */}
        </Box>
      )}
    </>
  );
};

export default SingleChat;
