import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Avatar, FormControl, Icon, IconButton, Input, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull, senderPic } from "../config/ChatLogics";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";

import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { FaUserGroup } from "react-icons/fa6";
import "./styles.css";

const ENDPOINT = "http://localhost:8888";
var socket, selectedChatCompare;

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

export default function SingleChat({ fetchAgain, setFetchAgain }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();

    const toast = useToast();
    const { selectedChat, user, setSelectedChat, notification, setNotification } = ChatState();

    //socket io state
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    const [timerId, setTimerId] = useState(null);

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
            socket.emit("join chat", selectedChat._id);
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
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                //give notification
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
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
                socket.emit("new message", data);
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

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        var timerLength = 3000;
        if (timerId) {
            clearTimeout(timerId);
        }
        let timer = setTimeout(() => {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }, timerLength);

        setTimerId(timer);
    };

    //OR

    // const typingHandler = (e) => {
    //     setNewMessage(e.target.value);

    //     if (!socketConnected) return;

    //     if (!typing) {
    //         setTyping(true);
    //         socket.emit("typing", selectedChat._id);
    //     }
    //     let lastTypingTime = new Date().getTime();
    //     var timerLength = 3000;
    //     setTimeout(() => {
    //         var timeNow = new Date().getTime();
    //         var timeDiff = timeNow - lastTypingTime;

    //         if (timeDiff >= timerLength && typing) {
    //             socket.emit("stop typing", selectedChat._id);
    //             setTyping(false);
    //         }
    //     }, timerLength);
    // };

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
                                <Flex alignItems="center">
                                    <Avatar size="sm" src={senderPic(user, selectedChat.users)} cursor="pointer" />
                                    <Text marginLeft="5px"> {getSender(user, selectedChat.users).toUpperCase()}</Text>
                                </Flex>

                                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                <Flex alignItems="center">
                                    {selectedChat && (
                                       
                                        <Icon as={FaUserGroup} />
                                    )}
                                    <Text marginLeft="5px"> {selectedChat?.chatName?.toUpperCase()}</Text>
                                </Flex>

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
                        <FormControl isRequired mt={3} onKeyDown={sendMessage}>
                            {isTyping ? (
                                <div>
                                    <Lottie
                                        width={70}
                                        options={defaultOptions}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}

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
                        Bringing Conversations to Life......
                    </Text>
                </Box>
            )}
        </>
    );
}
