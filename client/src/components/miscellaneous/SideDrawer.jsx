import { Box, Drawer, DrawerContent, DrawerHeader, DrawerOverlay, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { ImSearch } from "react-icons/Im";
import { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import { Avatar } from "@chakra-ui/avatar";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";

export default function SideDrawer() {
    const { user } = ChatState();
      const { isOpen, onOpen, onClose } = useDisclosure()
const navigate= useNavigate()
    // const [search,setSearch]=useState("")
    // const [searchResult,setSearchResult]=useState([])
    // const [loading,setLoading]=useState(false)
    // const [loadingChat,setLoadingChat]=useState(false)
const logoutHandler=()=>{
    localStorage.removeItem("userInfo")
    navigate("/")
}
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

                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                </DrawerContent>
            </Drawer>
        </>
    );
}
