import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Protected = ({Component}) => {
  const navigate = useNavigate()
    
  useEffect(()=>{
    const user = localStorage.getItem('userInfo')
    if(!user){
        navigate('/signin')
    }
  },[])

  return (
    <>
        <Component/>
    </>
  )
}

export default Protected