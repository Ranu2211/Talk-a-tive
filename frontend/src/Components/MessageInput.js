import React, { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { FormControl, Input, IconButton, Box, InputGroup, InputRightElement } from "@chakra-ui/react";
import toast from "react-hot-toast";

const MessageInput = ({ sendMessage, typingHandler, newMessage, setNewMessage }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle message send
  const handleSendMessage = async () => {
    if (newMessage.trim() || imagePreview) {
      await sendMessage(newMessage, imagePreview);
      setNewMessage("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Box>
      {imagePreview && (
        <Box display="flex" alignItems="center" mb={2}>
          <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px", borderRadius: "8px" }} />
          <IconButton icon={<X size={16} />} onClick={removeImage} ml={2} size="sm" aria-label="Remove image" />
        </Box>
      )}

      <FormControl isRequired mt={1}>
         {/* {isTyping ? <div>Typing..</div> : <></>} */}
        <InputGroup size="md">
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              typingHandler(e);
            }}
            pr="4.5rem"
            borderRadius="full"
            height="40px"
          />

          <InputRightElement width="4.5rem" display="flex" alignItems="center" gap="1">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden />
            <IconButton
              icon={<Image size={18} />}
              onClick={() => fileInputRef.current.click()}
              size="xs"
              variant="ghost"
              aria-label="Attach image"
            />
            <IconButton
              icon={<Send size={18} />}
              onClick={handleSendMessage}
              size="xs"
              variant="ghost"
              aria-label="Send message"
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </Box>
  );
};

export default MessageInput;
