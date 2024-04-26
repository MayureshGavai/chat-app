import React, { useEffect } from 'react'
import ChatList from '../components/ChatList'
import { useChatContext } from '../context/ChatContext';
import {useNavigate} from 'react-router-dom'
import ChatView from '../components/ChatView';

const HomePage = () => {
  const {selectedChat} = useChatContext()
  return (
    <div className='w-full flex flex-col lg:flex-row'>
      {/* ChatList */}
      <div className={`lg:w-1/4 ${selectedChat ? 'hidden lg:block' : 'block'}`}>
        <ChatList />
      </div>

      {/* ChatView */}
      <div className={`lg:w-3/4 ${selectedChat ? 'w-full' : 'hidden lg:block'}`}>
        <ChatView />
      </div>
    </div>
  )
}

export default HomePage