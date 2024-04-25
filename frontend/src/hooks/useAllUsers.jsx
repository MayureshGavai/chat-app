import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useChatContext } from "../context/ChatContext"

export const useAllUsers = () => {
    const {user} = useChatContext()
    const [loading,setLoading] = useState(false)
    const [allUsers,setAllUsers] = useState([])

    useEffect(()=>{
        const fetchAllUsers = async () => {
            setLoading(true)
            try{
                const res = await axios.get('http://localhost:3000/api/user',{
                    headers : {
                        Authorization : `Bearer ${user.token}`
                    }
                })
                const data = res.data
                if(!data){
                    throw new Error('data.error')
                }
                setAllUsers(data)
                // console.log(allUsers)
            }catch(error){
                toast.error(error.message,{
                    position:'top-center'
                })
            }finally{
                setLoading(false)
            }
        }
        fetchAllUsers()
    },[])
    return {loading,allUsers}
}