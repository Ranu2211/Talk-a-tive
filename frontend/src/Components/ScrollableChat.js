import React, {useEffect} from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Tooltip, Text, Box, Image } from '@chakra-ui/react';
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    useEffect(() => {
  console.log("All messages:", messages);
  if (messages) {
    console.log("Messages with images:", 
      messages.filter(m => m.image).map(m => ({ id: m._id, image: m.image }))
    );
  }
}, [messages]);
    return (
        <ScrollableFeed>
            {console.log("ScrollableChat rendering, messages:", messages)}
            {messages && messages.map((m, i) => (
                //console.log("Rendering message:", i, m);

                <div style={{ display: "flex" }} key={m._id}>
                    {(isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id)) && (
                            <Tooltip
                                label={m.sender.name}
                                placement="bottom-start"
                                hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                }`,
                            borderRadius: "20px",
                            padding: "5px  15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                        }}
                    >
                        {m.content && (
                            <Text as="span">{m.content}</Text>
                        )}
                        {m.image && (
                            <Box display="flex" justifyContent="center" mt={m.content ? 2 : 0}>

                                <Image
                                    src={m.image}
                                    alt="Message attachment"
                                    maxH="200px"
                                    maxW="100%"
                                    borderRadius="md"
                                    cursor="pointer"
                                    onClick={() => window.open(m.image, '_blank')}
                                // onError={(e) => {
                                //     console.error('Image failed to load:', e); 
                                // }}
                                />
                            </Box>
                        )}
                    </span>
                </div>
))}
        </ScrollableFeed>
    )
}

export default ScrollableChat