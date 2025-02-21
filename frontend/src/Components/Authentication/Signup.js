import { FormControl, FormLabel, VStack, Input, InputGroup, Button, InputRightElement } from '@chakra-ui/react'
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom';
import axios from "axios";

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => {
        setShow(!show);
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (password !== confirmpassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        console.log("Submitting with:", { name, email, password }); // Debug log

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user",
                { name, email, password, pic },
                config
            );

            toast({
                title: "Registration successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");

        } catch (error) {
            console.log("Error details:", error.response?.data); // Debug log
            toast({
                title: "Error Occurred!",
                description: error.response?.data?.message || "Registration failed",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const setGuestCredentials = () => {
        setName("Guest User");
        setEmail("guest@example.com");
        setPassword("123456");
        setConfirmpassword("123456");
        
        // Debug log to verify state updates
        console.log("Guest credentials set:", {
            name: "Guest User",
            email: "guest@example.com",
            password: "123456"
        });
    };

    return (
        <VStack spacing="5px" color="black">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}  // Added value prop
                />
            </FormControl>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}  // Added value prop
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}  // Added value prop
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                        value={confirmpassword}  // Added value prop
                    />
                </InputGroup>
            </FormControl>

            <Button
                colorScheme="blue"
                width="100%"
                mt={4}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>

            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                mt={2}
                onClick={setGuestCredentials}
                isLoading={loading}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Signup;