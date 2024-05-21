import React, { useState } from 'react'
import { useChatContext } from '../context/ChatContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import {  IoClose } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'

const CreateGroup = ({closeModal}) => {
  const {themeMode} = useTheme()
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
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/search?search=${search}`,{
        headers : {
          Authorization : `Bearer ${user.token}`
        }
      })
      const data = res.data
      setSearchResult(data)
    }catch(err){
      toast.error(err.message,{
        position:"top-center"
      })
    }
  }

  const handleGroup = (userToAdd) => {
    if(selectedUser.includes(userToAdd)){
      toast.warn('User is already added',{
        position: "top-center"
      })
      return
    }
    setSelectedUser([...selectedUser,userToAdd])
  }

  const deleteUser = (delId) => {
    setSelectedUser(selectedUser.filter(user => user._id !== delId))
  }

  const handleSubmit = async () => {
    if(!groupChatName || !selectedUser){
      toast.warning("Please fill all fields",{
        position:"top-center"
      })
      return
    }
    if(selectedUser.length<2){
      toast.warning("Atleast 2 users needed in group",{
        position:"top-center"
      })
      return
    }
    try{
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chat/group`,{
        name: groupChatName,
        users : JSON.stringify(selectedUser.map(user=>user.id))
      },{
        headers:{
          Authorization : `Bearer ${user.token}`
        }
      })
      const data = res.data
      setChats([data,...chats])
      toast.success("Group created successfully.!!",{
        position:"top-center"
      })
      closeModal()
    }catch(error){
      toast.error(error.message,{
        position:'top-center'
      })
    }
  }

  return (
    <div>
      <h1 className='font-semibold'>Create Group</h1>
      <div className='w-full flex flex-col mb-2'>
        <label htmlFor="" className='text-sm my-1 '>Group Name</label>
        <input type="text" onChange={(e)=>setGroupChatName(e.target.value)} placeholder='Enter group name' className='bg-transparent border rounded-md px-2 py-1 dark:text-white dark:border-gray-600 ' />
      </div>
      <div className='w-full flex flex-col mb-2'>
        <label htmlFor="" className='text-sm my-1 '>Add Group Participants</label>
        <input type="text" onChange={(e)=>handleSearch(e.target.value)} placeholder='Enter participants names' className='bg-transparent border rounded-md px-2 py-1 dark:text-white dark:border-gray-600 ' />
        <div className='flex gap-2 items-center'>
        {
          selectedUser?.map(user=>{
            return <div key={user._id} className={`my-2 w-fit flex items-center px-2 py-1 text-sm rounded-md border ${themeMode === "light" ? "bg-gray-900 text-white" : "text-gray-900 bg-white" }`}>
              <h1 className='capitalize'>{user.name}</h1>
              <button className='ml-1' onClick={()=>deleteUser(user._id)}>
              <IoClose />
              </button>
            </div>
          }) 
        }
        </div>
        {/* {searchResult.length === 0 && <p>No results found</p>} */}
        {
          searchResult?.users?.slice(0,4).map(user => {
            return <div key={user._id} className='my-2 p-2 flex items-center rounded-md cursor-pointer border dark:border-gray-600 dark:text-white'>
            <img src={user.image} alt="" className='w-12 h-12 mr-4' />
            <div className='flex flex-col'
                onClick={()=>handleGroup(user)}
            >
                <h1 className='text-lg capitalize'>{user.name}</h1>
                <h1 className='text-sm'>mail : {user.email}</h1>
            </div>
        </div>  
          })
        }
      </div>
      <div className='mt-4 flex items-end'>
      <button onClick={handleSubmit} className={`px-3 py-1.5 rounded-md ${themeMode === "light" ? "bg-gray-900 text-white" : "text-gray-900 bg-white" } `}>Create Chat</button>
      </div>

    </div>
  )
}

export default CreateGroup