import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
import { FormControl, IconButton, Input, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";

export default function SingleChat({ fetchAgain, setFetchAgain }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();

    const toast = useToast();
    const { selectedChat, user, setSelectedChat } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Access-Control-Allow-Origin": "http://localhost:8888/",
                },
            };

            setLoading(true);
            const { data } = await axios.get(
                `http://localhost:8888/api/message/${selectedChat._id}`,

                config
            );

            setMessages(data);
            setLoading(false);
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
        fetchMessages();
    }, [selectedChat]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Access-Control-Allow-Origin": "http://localhost:8888/",
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "http://localhost:8888/api/message",
                    { content: newMessage, chatId: selectedChat._id },
                    config
                );

                setMessages([...messages, data]);
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
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    };
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
                                <UpdateGroupChatModal
                                    fetchMessages={fetchMessages}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
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
                        {/* chat will display here */}


                        {loading ? (
                            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage}>
                            <Input
                                color="black"
                                variant="filled"
                                bg="E0E0E0"
                                placeholder="Enter A Message"
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
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
