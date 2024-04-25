import React, { useEffect } from 'react'
import ChatList from '../components/ChatList'
import { useChatContext } from '../context/ChatContext';
import {useNavigate} from 'react-router-dom'

const HomePage = () => {
  
  return (
    <div className='w-full flex'>
      <ChatList className="w-1/4"/>
      HomePage
    </div>
  )
}

export default HomePage