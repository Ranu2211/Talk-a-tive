import { createContext, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const ChatContext = createContext(null);

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const history = useHistory();
    const location = useLocation();
    const publicRoutes = ['/', '/reset-password'];

    const resetChatState = () => {
        setSelectedChat(null);
        setChats([]);
        setNotification([]);
    }
    const setUserWithReset = (newUser) => {
        if (!newUser || (user && newUser && user._id !== newUser._id)) {
            resetChatState();
        }
        setUser(newUser);
    }

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUserWithReset(userInfo);
        const isPublicRoute = publicRoutes.some(route =>
            location.pathname === route || location.pathname.startsWith(route + '/')
        );

        if (!userInfo && !isPublicRoute) {
            history.push("/");
        }
        // eslint-disable-next-line
    }, [history, location]);

    const logoutUser = () => {
        resetChatState();
        localStorage.removeItem("userInfo");
        setUser(null);
        history.push("/");
    }

    return (
    <ChatContext.Provider 
    value={{
        user, setUser: setUserWithReset, selectedChat, setSelectedChat,
        chats, setChats, notification, setNotification, resetChatState, logoutUser
    }}
    >
        {children}
        </ChatContext.Provider>
        );
};
//export default ChatProvider;
export const ChatState = () => {
    return useContext(ChatContext);
}
export default ChatProvider;
