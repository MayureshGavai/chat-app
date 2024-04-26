import React, { useState } from 'react'
import { useAllUsers } from '../hooks/useAllUsers'
import {MagnifyingGlass} from 'react-loader-spinner'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useChatContext } from '../context/ChatContext'

const AllUsers = ({closeModal}) => {
    const {user,chats,setChats} = useChatContext()
    const {loading,allUsers} = useAllUsers()
    const [loadingChat,setLoadingChat] = useState(false)
    console.log(allUsers)
    
    const accessChat = async (userId) => {
       
        setLoadingChat(true)
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
            setChats(prevChats => {
                if (!prevChats.find(c => c._id === data._id)) {
                    return [data, ...prevChats];
                } else {
                    return prevChats;
                }
            })

            setChats(data)
            console.log(chats)
            closeModal()
        }catch(error){
            toast.error(error.message,{
                position:'top-center'
            })
            console.log(error.message)
        }finally{
            setLoadingChat(false)
        }
    }
  return (
    <div>
        <h1 className='font-semibold'>All Users</h1>
        {
            loading ? (
                <div className=' flex items-center justify-center'>
                        <MagnifyingGlass
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="magnifying-glass-loading"
                            wrapperStyle={{}}
                            wrapperClass="magnifying-glass-wrapper"
                            glassColor="#c0efff"
                            color="#047857"
                        />
                    </div>
            ) : (
                // <h1>{allUsers?.users?.length}</h1>
                <ul className='overflow-y-auto'>
                {allUsers?.users?.map(user => (
                    <li key={user._id} className='my-2 p-2 flex items-center rounded-md cursor-pointer border dark:border-gray-600 dark:text-white'>
                        <img src={user.image} alt="" className='w-12 h-12 mr-4' />
                        <div className='flex flex-col'
                            onClick={()=>accessChat(user._id)}
                        >
                            <h1 className='text-lg capitalize'>{user.name}</h1>
                            <h1 className='text-sm'>mail : {user.email}</h1>
                        </div>
                    </li>  
                ))}
                </ul>
                
            )
        }
    </div>
  )
}

export default AllUsers