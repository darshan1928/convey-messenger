import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, Text } from '@chakra-ui/layout'
import { IconButton, Image } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

export default function SingleChat({fetchAgain,setFetchAgain}) {

const [messages,setMessages]=useState()
const [loading,setLoading]=useState()
const [newMessages,setNewMessages]=useState()



  const  {selectedChat,user,setSelectedChat}= ChatState()
  return (
      <>
          {selectedChat ? (
              <>
                  <Text
                      display="flex"
                      w="100%"
                      fontSize={{ base: "28px", md: "30px" }}
                      pb={3}
                      justifyContent={{ base: "space-between" }}
                      px={2}
                      fontFamily="work sans"
                      color="black"
                      alignItems="center"
                  >
                      <IconButton
                          display={{ base: "flex", md: "none" }}
                          icon={<ArrowBackIcon />}
                          onClick={() => setSelectedChat("")}
                      />
                      {selectedChat.isGroupChat === "false" ? (
                          <>
                              {getSender(user, selectedChat.users)}
                              <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                          </>
                      ) : (
                          <>
                              {selectedChat?.chatName?.toUpperCase()}
                              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                          </>
                      )}
                  </Text>
                  <Box
                      display="flex"
                      justifyContent="flex-end"
                      flexDir="column"
                      p={3}
                      bg="#E8e8e8"
                      w="100%"
                      h="100%"
                      borderRadius="lg"
                      overflowY="hidden"
                  >
                      {/* Messages here */}
                  </Box>
              </>
          ) : (
              <Box display="flex" alignItems="center" h="100%">
                  <Text fontSize="3xl" pb={3} fontFamily="work sans" color="black">
                      Click on a User to Start Chatting
                  </Text>
                 
              </Box>
          )}
      </>
  );
}
