import { useEffect, useState } from "react"
import { useChatContext } from "../context/ChatContext"
import axios from "axios"
import { toast } from "react-toastify"

export const useAddToChats = () => {
    const {user} = useChatContext()
    const [loading,setLoading] = useState(false)
    const {chats,setChats} = useChatContext()

    useEffect(()=>{
        const createChat = async({userId}) => {
            setLoading(true)
            try{
                const res =  await axios.post("http://localhost:3000/api/chat",{userId},{
                    headers : {
                        Authorization : `Bearer ${user.token}`
                    }
                })
                const data = res.data
                if(!data){
                    throw new Error('data.error')
                }
                if(!chats.find((c) => c._id === data._id)){
                    setChats([data,...chats])
                }
                setChats(data)
            }catch(error){
                toast.error(error.message,{
                    position:'top-center'
                })
            }finally{
                setLoading(false)
            }
        }
        createChat(user)
    },[])
    
    return {loading,chats}
}