import {
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Image,
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
import { BellIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import { Avatar } from "@chakra-ui/avatar";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import {TbUserSearch} from "react-icons/tb"
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./sideDrawer.css"

export default function SideDrawer() {
    const { user, setSelectedChat, chats, setChats, selectedChat ,notification,setNotification} = ChatState();
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
//searching user
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
            console.log(user.token,"user.token");
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Access-Control-Allow-Origin": "http://localhost:8888/",
                },
            };
            // api/user/query - get allUsers
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

    //accessing to all user except login user
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
            //    selected user details = data
            //   api/chat post-  accessChat
            const { data } = await axios.post("http://localhost:8888/api/chat", { userId }, config);
             
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); // confusing

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
                {/* <Text fontSize="2xl" fontFamily="work sans">
                    CONVEY
                </Text> */}
                <Image objectFit="cover" boxSize="50px" width="120px" src="/convey-logo.png" alt="logo" />
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <div className="notification-badge">
                                <span style={{ display: notification.length == 0 ? "none" : "block" }} className="badge">
                                    {notification.length}
                                </span>
                            </div>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notify) => (
                                <MenuItem
                                    key={notify._id}
                                    onClick={() => {
                                        setSelectedChat(notify.chat);
                                        setNotification(notification.filter((n) => n !== notify));
                                    }}
                                >
                                    {notify.chat.isGroupChat === "true"
                                        ? `New Message in ${notify.chat.chatName}`
                                        : `New Message from ${getSender(user, notify.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<BsThreeDotsVertical style={{ fontSize: "23px" }} />}>
                            <Avatar size="sm" name={user.name} src={user.pic} cursor="pointer" />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>
                                    <CgProfile style={{ marginRight: "5px" }} />
                                    Profile
                                </MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>
                                <RiLogoutCircleRLine style={{ marginRight: "5px" }} />
                                Logout
                            </MenuItem>
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
                                placeholder="Search name or email..."
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>
                                <TbUserSearch size={"2em"} />
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                //all user except login user
                                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
