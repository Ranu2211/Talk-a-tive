import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    Lorem,
    Image,
    Text
  } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'


const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    {children ? (
        <span onClick={onOpen}>{children}</span>
    ): (
        <IconButton d={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
    )}

<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
          fontSize="36px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          textAlign="center"

          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
           display="flex"
           justifyContent="space-between" 
           alignItems="center"
           flexDir= "column"
           
          >
          <Image borderRadius= "full" 
          borderColor="black"
          display="flex"
          justifyContent="center"
          boxSize="150px"
          src={user.pic}
          alt={user.name}/>
          <Text fontSize={{base: "25px", md: "25px"}}
          fontFamily="Work sans">Email: {user.email}
          </Text>
          </ModalBody>

          <ModalFooter>
            <Button
             colorScheme='blue'
            //  color= "white"
            // backgroundColor="blue"
            
            //  color="blue"
              mr={3} 
              onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    
    
    
    </>
  )
}

export default ProfileModal