import { AddIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

export default function GroupChatModal({ children }) {
    const OverlayOne = () => <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = React.useState(<OverlayOne />);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [state, setState] = useState(false);
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { user, chats, setChats } = ChatState();

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
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
             return;
        }

          try {
              const config = {
                  headers: {
                      Authorization: `Bearer ${user.token}`,
                      "Access-Control-Allow-Origin": "http://localhost:8888/",
                  },
              }
         
              const { data } = await axios.post("http://localhost:8888/api/chat/group",{name:groupChatName,users:JSON.stringify(selectedUsers.map((u)=>u._id))}, config);
              setChats([data,...chats])
             
              onClose()
             toast({
                 title: "New Group Created",
            
                 status: "success",
                 duration: 5000,
                 isClosable: true,
                 position: "bottom-left",
             });
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
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };
    return (
        <>
            <Button
                onClick={() => {
                    setOverlay(<OverlayOne />);
                    onOpen();
                }}
                rightIcon={<AddIcon />}
                display="flex"
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            >
                Add to Group
            </Button>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent>
                    <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
                        Create Group chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input placeholder="Chat Name" mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder="Add Users" mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((user) => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                            ))}
                        </Box>
                        {/* render users where added to group */}
                        {loading ? (
                            <div>Loading</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((u) => <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />)
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit}>Save</Button>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
