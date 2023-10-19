import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/layout';
import SingleChat from './SingleChat';




export default function ChatBox({fetchAgain, setFetchAgain}) {
  const { selectedChat } = ChatState();
  return (
    <Box 
    display={{base:selectedChat?"flex":"none",md:"flex"}}
    borderRadius="lg"
    borderWidth="1px"
    bg="white"
    p={3}
    w={{base:"100%",md:"68%"}}
    flexDir="column"
    alignItems="center"
    
    
    >
<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}
