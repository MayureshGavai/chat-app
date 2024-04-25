import { createContext, useContext, useEffect, useState } from "react";

export const ChatContext = createContext()

export const useChatContext = () => {
    return useContext(ChatContext)
}

export const ChatProvider = ({children}) => {
    const [user,setUser] = useState()
    const [chats,setChats] = useState([])
    
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        if (userInfo) {
            setUser(userInfo);
        }
    },[])

    return (
        <ChatContext.Provider value={{user,setUser,chats,setChats}}>
            {children}
        </ChatContext.Provider>
    )
} 
