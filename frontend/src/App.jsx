import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import HomePage from './pages/HomePage'
import ChatsPage from './pages/ChatsPage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'

const App = () => {
  return (
    <div className='font-Inter'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/chats' element={<ChatsPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/signin' element={<SigninPage/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer />

    </div>
  )
}

export default App