import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification,setNotification]=useState([])
    const navigate = useNavigate();

    useEffect(() => {


        const userInfo = localStorage.getItem("userInfo")
          if (userInfo) {
            try {
                console.log(userInfo);
                const  data = JSON.parse(userInfo);
                console.log("data==", data);
                setUser(data);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                
            }
          } else {
              navigate("/");
          }
       
    
    }, [navigate]);

    return (
        <ChatContext.Provider value={{notification,setNotification, user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
