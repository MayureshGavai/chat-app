import React, { useState } from 'react'
import { useChatContext } from '../context/ChatContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const CreateGroup = () => {
  const {user, chats, setChats} = useChatContext()
  const [groupChatName,setGroupChatName] = useState()
  const [selectedUser,setSelectedUser] = useState([]) 
  const [search,setSearch] = useState("")
  const [searchResult,setSearchResult] = useState([])


  const handleSearch = async (query) => {
    setSearch(query)
    if(!query){
      setSearchResult([]);
      return
    } 
    try{
      const res = await axios.get(`http://localhost:3000/api/user?search=${search}`,{
        headers : {
          Authorization : `Bearer ${user.token}`
        }
      })
      const data = res.data
      setSearchResult(data)
      console.log(searchResult)
    }catch(err){
      toast.error(err.message,{
        position:"top-center"
      })
    }
  }

  return (
    <div>
      <h1 className='font-semibold'>Create Group</h1>
      <div className='w-full flex flex-col mb-2'>
        <label htmlFor="" className='text-sm my-1 '>Group Name</label>
        <input type="text" className='bg-transparent border rounded-md px-2 py-1 dark:text-white dark:border-gray-600 ' />
      </div>
      <div className='w-full flex flex-col mb-2'>
        <label htmlFor="" className='text-sm my-1 '>Add Group Participants</label>
        <input type="text" onChange={(e)=>handleSearch(e.target.value)} className='bg-transparent border rounded-md px-2 py-1 dark:text-white dark:border-gray-600 ' />
        {searchResult.length === 0 && <p>No results found</p>}
        {
          searchResult?.users?.slice(0,4).map(user => {
            return <div key={user._id} className='my-2 p-2 flex items-center rounded-md cursor-pointer border dark:border-gray-600 dark:text-white'>
            <img src={user.image} alt="" className='w-12 h-12 mr-4' />
            <div className='flex flex-col'
                // onClick={()=>accessChat(user._id)}
            >
                <h1 className='text-lg capitalize'>{user.name}</h1>
                <h1 className='text-sm'>mail : {user.email}</h1>
            </div>
        </div>  
          })
        }
      </div>
      <div className='mt-4 flex items-end'>
      <button className='px-3 py-1.5 rounded-md bg-gray-900 text-white dark:text-gray-900 dark:bg-gray'>Create Chat</button>
      </div>

    </div>
  )
}

export default CreateGroup