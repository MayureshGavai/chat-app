import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ChatsPage = () => {
    const [chats,setChats] = useState([])
    const fetchChatsData = async () => {
        const res = await axios.get('http://localhost:3000/api/chats')
        const data = res.data
        setChats(data)
        console.log(data)
    }

    useEffect(()=>{
        fetchChatsData()
    },[])

  return (
    <div className=''>
        <h1 className='texxt-2xl'>ChatsPage</h1>
        {
            chats?.map((chat)=>{
                return <div key={chat._id}>
                    <h1>{chat.chatName}</h1>
                </div>
            })
        }
    </div>
  )
}

export default ChatsPage