import { Box } from "@chakra-ui/layout";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
export default function ChatPage() {
    const { user } = ChatState();
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px" color="white">
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    );
}
