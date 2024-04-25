import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import HomePage from './pages/HomePage'
import ChatsPage from './pages/ChatsPage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { ThemeProvider } from './context/ThemeContext';
import { useChatContext } from './context/ChatContext';

const App = () => {

  // const {setUser} = useChatContext()

  // useEffect(()=>{
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  //   if (userInfo) {
  //       setUser(userInfo);
  //   }
  //   console.log(userInfo)
  // },[])

  // useEffect(()=>{
  //   document.querySelector("html").classList.remove("dark","light")
  //   document.querySelector("html").classList.add(themeMode)
  // },[themeMode])

  return (
    <div className='font-Inter'>
      <ThemeProvider >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/chats' element={<ChatsPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/signin' element={<SigninPage/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
      </ThemeProvider>

    </div>
  )
}

export default App