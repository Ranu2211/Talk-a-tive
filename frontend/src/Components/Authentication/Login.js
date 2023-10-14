import { FormControl, FormLabel, VStack,Input, InputGroup, Button,InputRightElement } from '@chakra-ui/react'
import React,{useState} from 'react';
import { useToast } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom';
import axios from "axios";

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();
    
    const handleClick = () => {
        setShow(!show);
    }
    const submitHandler = async() => {
        setLoading(true);
          if(!email || !password ){
            toast({
                title: 'Please Fill all the Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
          }
        console.log(email,password);
          try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const {data} = await axios.post(
                "https://ftrrrfffgfg.onrender.com/api/user/login",
                { email,password},
                config
            );
            toast({
                title: "Login successful",
                status: 'Success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
          }
          catch(error){
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
          }
    };
  return (
    <VStack spacing= "4px" color="black">
        
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
            placeholder="Enter your Email"
            value={email}
            onChange = {(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
            type= {show? "text"  :  "password"}
            placeholder="Enter your password"
            value={password}
            onChange = {(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "show"}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        
<Button
// color= "white"
// backgroundColor="blue"
colorScheme= "blue"
style={{marginTop: 15}}
width ="100%"
onClick={submitHandler}
isLoading = {loading}
> Sign up</Button>

<Button
variant= "solid"
colorScheme= "red"
// color= "white"
// backgroundColor="red"
// color="red"
width ="100%"

onClick={() => {
    setEmail("guest@example.com");
    setPassword("123456")
}}
> Get Guest User Credentials</Button>
</VStack>
  );
};

export default Login