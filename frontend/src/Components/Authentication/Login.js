import { FormControl, FormLabel, VStack, Input, InputGroup, Button, InputRightElement, Text, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const history = useHistory();
    const {setUser} = ChatState();

    const handleClick = () => setShow(!show);
const baseURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    // Forgot Password Handler
    const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
        toast({
            title: 'Please enter your email.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: { "Content-Type": "application/json" },
        };

        await axios.post(
            `${baseURL}/api/user/send-mail`,
            { email: forgotEmail }, 
            config
        );

        toast({
            title: 'Reset link sent to your email.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        onClose();
    } catch (error) {
        toast({
            title: 'Failed to send email.',
            description: error.response?.data?.message || 'Try again later.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } finally {
        setLoading(false);
    }
};


    const submitHandler = async () => {
        setLoading(true);
        if (!email.trim() || !password.trim()) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
            const { data } = await axios.post(
                `${baseURL}/api/user/login`,
                 { email, password }, config);
            toast({
                title: 'Login successful',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
             setUser(data)
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
        } catch (error) {
            toast({
                title: 'Error occurred',
                description: error.response?.data?.message || 'Invalid email or password',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
        } 
    };

    return (
        <VStack spacing="4px" color="black">
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme="blue" mt={4} width="100%" onClick={submitHandler} isLoading={loading}>
                Login
            </Button>

            <Text mt={3}>
                <Link color="blue.500" onClick={onOpen}>
                    Forgot Password?
                </Link>
            </Text>

            {/* Forgot Password Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Forgot Password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Enter your email</FormLabel>
                            <Input
                                placeholder="Enter your email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleForgotPassword} isLoading={loading}>
                            Send Reset Link
                        </Button>
                        <Button ml={3} onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default Login;
