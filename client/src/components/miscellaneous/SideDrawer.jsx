import {
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { ImSearch } from "react-icons/Im";
import { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import { Avatar } from "@chakra-ui/avatar";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

export default function SideDrawer() {
    const { user, setSelectedChat, chats, setChats, selectedChat } = ChatState();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter Something",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
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
            const { data } = await axios.get(`http://localhost:8888/api/user?search=${search}`, config);
            setSearchResult(data);
            setLoading(false);
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
       const accessChat = async (userId) => {
           try {
               setLoadingChat(true);
               const config = {
                   headers: {
                       "Content-type": "application/json",
                       Authorization: `Bearer ${user.token}`,
                       "Access-Control-Allow-Origin": "http://localhost:8888/",
                   },
               };

               const { data } = await axios.post("http://localhost:8888/api/chat", { userId }, config);
//    selected user details =data
               if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);  // confusing 

               setSelectedChat(data);
               setLoadingChat(false);
               onClose();
           } catch (error) {
               toast({
                   title: "Error Occurred",
                   description: error.message,
                   status: "warning",
                   duration: 5000,
                   isClosable: true,
                   position: "bottom-left",
               });
           }
       };
    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="100%"
                bg="white"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <ImSearch />
                        <Text d={{ base: "none", md: "flex" }} px="4">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="work sans">
                    Convey Messenger
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        {/* <MenuList></MenuList> */}
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" name={user.name} src={user.pic} cursor="pointer" />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box p={2} display="flex">
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex"/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
