import { Box, FormControl, FormLabel, VStack, Input, InputGroup, Button, InputRightElement, Container, Text, Divider, HStack, Link } from '@chakra-ui/react';
import React, { useState , useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import { useParams } from 'react-router-dom'

const ResetPassword = () => {
   const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const history = useHistory();
  const toast = useToast();
  const { token } = useParams();  

  //Validate token on component mount
  const baseURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
  useEffect(() => {
        if (!token) {
            toast({
                title: "Invalid Reset Link",
                description: "Please use a valid password reset link",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            history.push("/");
        }
    }, [token, history, toast]);


  const handleClick = () => setShow(!show);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast({
        title: "Please fill the password",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${baseURL}/api/user/reset-password/${token}`,
        { password },
        config
      );

      console.log("Response from server:", data);

      toast({
        title: "Password updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.clear();
      history.push("/");
    } catch (error) {
      console.error("Reset password error:", {
        response: error.response?.data,
        status: error.response?.status
      });

      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Password update failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

    return (
        <Container centerContent minH="100vh" display="flex" justifyContent="center" alignItems="center">
            <Box bg="white" p={8} boxShadow="lg" borderRadius="lg" width="100%" maxW="400px">
                <VStack spacing={4} color="black">
                    <FormControl id="email" isRequired>
                        <FormLabel>New Password</FormLabel>
                        <InputGroup>
                            <Input
                                type={show ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleClick}>
                                    {show ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <Button
                        colorScheme="blue"
                        width="100%"
                        onClick={submitHandler}
                        isLoading={loading}
                    >
                        Reset Password
                    </Button>

                    {/* Divider with Or */}
                    <HStack width="100%" spacing={4} alignItems="center">
                        <Divider />
                        <Text color="gray.500">Or</Text>
                        <Divider />
                    </HStack>

                    {/* Sign Up Link */}
                    <Text>
                        Don't have an account?{" "}
                        <Link color="blue.500" onClick={() => history.push('/')}>
                            Sign Up
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default ResetPassword;
