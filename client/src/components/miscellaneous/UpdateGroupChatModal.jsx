import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

export default function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
    const OverlayOne = () => <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = useState(<OverlayOne />);
    const [renameLoading, setRenameLoading] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Access-Control-Allow-Origin": "http://localhost:8888/",
                },
            };

            //api/user/  allUser  get
            const { data } = await axios.get(`http://localhost:8888/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Fetching the Chat",
                description: "Failed to load Search Results",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Access-Control-Allow-Origin": "http://localhost:8888/",
                },
            };

            const { data } = await axios.put(
                "http://localhost:8888/api/chat/rename",
                { chatName: groupChatName, chatId: selectedChat._id },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occurred",
                description: error.response.data.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User already in Group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add a Member",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Access-Control-Allow-Origin": "http://localhost:8888/",
                },
            };

            const { data } = await axios.put(
                `http://localhost:8888/api/chat/groupadd`,
                { chatId: selectedChat._id, userId: user1._id },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occurred",

                status: error.response.data.message,
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only Admin can remove a member",

                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Access-Control-Allow-Origin": "http://localhost:8888/",
                },
            };

            const { data } = await axios.put(
                `http://localhost:8888/api/chat/groupremove`,
                { chatId: selectedChat._id, userId: user1._id },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <IconButton
                display={{ base: "flex" }}
                icon={<ViewIcon />}
                ml="4"
                onClick={() => {
                    setOverlay(<OverlayOne />);
                    onOpen();
                }}
            />

            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent>
                    <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                value={groupChatName}
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />

                            <Button
                                variant="solid"
                                colorScheme="teal"
                                placeholder="Add Users"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl display="flex">
                            <Input placeholder="Add User to Group" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((u) => (
                                <UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
