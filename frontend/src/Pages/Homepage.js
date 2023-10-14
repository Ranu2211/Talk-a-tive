import React, {useEffect} from 'react'
import {Container,Box,Text,Tabs,TabList,Tab,TabPanel,TabPanels} from "@chakra-ui/react";
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/Signup';
import { useHistory } from "react-router-dom";

export const Homepage = () => {
  const history = useHistory();
  useEffect (() =>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
   

    if(user)
        history.push("/chats");
}, [history]);




  return (
   <Container maxW = "xl" centerContent>
     <Box
     d = "flex"
     justifyContent= "center"
     p = {3}
     bg={"white"}
     w="100%"
     m="40px 0 15px 0"
     borderRadius="lg"
     borderWidth="1px"
     textAlign="center"
    >
      <Text fontSize= "4xl" fontFamily="Work sans" color="black" >Talk-A-Tive</Text>
    </Box>

<Box bg="white" w ="100%" p={2} borderRadius="lg" borderWidth="1px" color="black">
<Tabs variant='soft-rounded' >
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab  width="50%">Signup</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
    <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
</Box>
   </Container>
  )
}

