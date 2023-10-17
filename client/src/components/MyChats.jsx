import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Stack, Text, useToast } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../components/ChatLoading";
import { getSender } from "../config/ChatLogics";

export default function MyChats() {
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

            const { data } = await axios.get("http://localhost:8888/api/chat", config);
            console.log(data);
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
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, []);

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
                My Chats
                <Button rightIcon={<AddIcon />} display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }}>
                    New Group Chat
                </Button>
            </Box>
            <Box display="flex" flexDir="column" p={3} w="100%" h="100%" bg="#F8F8F8" borderRadius="1g" overflowY="hidden">
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
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
                                <Text>{!chat.isGroupchat ? getSender(loggedUser, chat.users) : chat.chatName}</Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
}
