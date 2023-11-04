import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Avatar, Stack, Text, useToast } from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/layout";

import axios from "axios";

import ChatLoading from "../components/ChatLoading";
import { getSender, senderPic } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";

import { FaUserGroup } from "react-icons/fa6";
export default function MyChats({ fetchAgain }) {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const toast = useToast();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Access-Control-Allow-Origin": "http://localhost:8888/",
                },
            };
            // api/chat/   get
            // to get all the users we have messaged
            const { data } = await axios.get("http://localhost:8888/api/chat", config);

            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occurred",
                description: "Failed to Load the Chats",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            setLoggedUser(userInfo);
        } catch (error) {
            console.error("Error parsing userInfo:", error);
        }

        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            w={{ base: "100%", md: "31%" }}
            bg="white"
            borderRadius="1g"
            borderWidth="1px"
        >
            <Box
                px={3}
                pb={3}
                fontSize={{ base: "28px", md: "30px" }}
                color="black"
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                Chats
                <GroupChatModal />
                {/* 
                <Button rightIcon={<AddIcon />} display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }}>
                    New Group Chat
                </Button> */}
                {/* </GroupChatModal> */}
            </Box>
            <Box display="flex" flexDir="column" p={3} w="100%" h="100%" bg="#F8F8F8" borderRadius="1g" overflowY="hidden">
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => {
                            const sender =
                                chat?.isGroupChat === "false" ? getSender(loggedUser, chat.users) : chat?.chatName;

                            // Check if sender is not empty before rendering the Box component
                            if (sender) {
                                return (
                                    <Box
                                        display="flex"
                                        flexDir="row"
                                        key={chat._id}
                                        color={selectedChat === chat ? "white" : "black"}
                                        px={3}
                                        onClick={() => setSelectedChat(chat)}
                                        py={2}
                                        w="100%"
                                        h="100%"
                                        bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                        cursor="pointer"
                                        borderRadius="lg"
                                    >
                                        {chat?.isGroupChat === "false" ? (
                                            <Flex alignItems="center">
                                                <Avatar
                                                    size="sm"
                                                    src={senderPic(loggedUser, chat.users)}
                                                    cursor="pointer"
                                                />
                                                <Text marginLeft="5px">{sender}</Text>
                                            </Flex>
                                        ) : (
                                            <Flex alignItems="center">
                                                <Avatar
                                                    size="sm"
                                                    icon={<FaUserGroup  fontSize="1.5rem" />}
                                                    cursor="pointer"
                                                />
                                              
                                                <Text marginLeft="5px">{sender}</Text>
                                            </Flex>
                                        )}
                                    </Box>
                                );
                            }

                            return null; // Don't render anything if sender is empty
                        })}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
}
