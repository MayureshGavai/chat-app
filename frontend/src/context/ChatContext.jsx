import { createContext, useContext, useEffect, useState } from "react";

export const ChatContext = createContext()

export const useChatContext = () => {
    return useContext(ChatContext)
}

export const ChatProvider = ({children}) => {
    const [user,setUser] = useState(JSON.parse(localStorage.getItem("userInfo")) || null)
    const [chats,setChats] = useState([])
    const [selectedChat,setSelectedChat] = useState()
    
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        if (userInfo) {
            setUser(userInfo);
        }
    },[])

    return (
        <ChatContext.Provider value={{user,setUser,chats,setChats,selectedChat,setSelectedChat}}>
            {children}
        </ChatContext.Provider>
    )
} 
