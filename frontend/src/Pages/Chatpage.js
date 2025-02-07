import { Box} from "@chakra-ui/layout"
import { Tooltip ,Flex} from '@chakra-ui/react'
import {ChatState} from "../Context/ChatProvider"
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
import {useState} from "react";


export const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();
  return( 
    <div style={{width:" 100%"}}>
       {user && <SideDrawer/>}
      <Flex justifyContent="space-between" flexDirection="row" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
       </Flex>
    </div>
    )
  
}

