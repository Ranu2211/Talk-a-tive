import { createContext, useContext, useEffect, useState } from "react";
import { useHistory , useLocation} from "react-router-dom";

const ChatContext = createContext(null);

 const ChatProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState();
    const [chats,setChats] = useState([]);
    const [notification,setNotification] = useState([]);
    const history = useHistory();
    const location = useLocation();
    const publicRoutes = ['/', '/test', '/reset-password'];

 useEffect (() =>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    const isPublicRoute = publicRoutes.some(route => 
            location.pathname === route || location.pathname.startsWith(route + '/')
        );

    if(!userInfo && !isPublicRoute){
        history.push("/");
    }
    // eslint-disable-next-line
  }, [history, location]);

    return (<ChatContext.Provider value={{user, setUser,selectedChat, setSelectedChat,
        chats,setChats,notification,setNotification}}>{children}</ChatContext.Provider>);
};
//export default ChatProvider;
export const ChatState = () => {
    return useContext(ChatContext);
}
export default ChatProvider;
