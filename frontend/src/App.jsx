import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import SigninPage from './pages/SigninPage'
import { ThemeProvider } from './context/ThemeContext';
import Protected from './pages/Protected';

const App = () => {



  return (
    <div className='font-Inter'>
      <ThemeProvider >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Protected Component={HomePage}/>}/>
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