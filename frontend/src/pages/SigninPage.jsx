import React, { useState } from 'react'
import ChatLogo from '../assets/ChatLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SigninPage = () => {
 
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const {data} = await axios.post('http://localhost:3000/api/user/signin',{email,password})
    console.log(data)
    if(data){
      setEmail("");
      setPassword("");
      localStorage.setItem("userInfo",JSON.stringify(data))
      toast.success("Signin Successful.!!",{
        position:"top-center"
      })
      setTimeout(()=>{
        navigate("/")
      },2000)
    }else{
      toast.error("Signin failed",{
        position:"top-center"
      })
    }
  };

  const guestUser = async () => {
    const guestMail = "guest@gmail.com"
    const guestPassword = "Guest"
    const {data} = await axios.post('http://localhost:3000/api/user/signin',{email:guestMail,password:guestPassword})
    console.log(data)
    if(data){
      setEmail("");
      setPassword("");
      localStorage.setItem("userInfo",JSON.stringify(data))
      toast.success("Signin Successful.!!",{
        position:"top-center"
      })
      setTimeout(()=>{
        navigate("/")
      },2000)
    }else{
      toast.error("Signin failed",{
        position:"top-center"
      })
    }
  }

  return (
    <div className="w-3/4 md:w-1/2 lg:w-1/4 mx-auto border rounded-lg mt-8 py-2">
      <div className="flex flex-col items-center justify-center mt-3">
      <div className="flex flex-col items-center justify-center text-lg">
          <img src={ChatLogo} alt="" className='w-12'/>
          {/* <PiChatCircleTextFill className="text-5xl text-blue-500" /> */}
          {/* <h1 className="ml-0.5 -mt-1 font-semibold text-center">Chat App</h1> */}
        </div>
    </div>
      <h1 className="text-4xl text-center my-4 font-medium">Signin</h1>
      <form onSubmit={handleSubmit} className="px-3 pt-3">
        <div className="mb-3">
          <input
            type="email"
            className="w-full px-2 py-1 text-lg border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="mb-3 w-full">
          <div className="relative w-full">
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="w-full px-2 py-1 text-lg border rounded-md "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <h1 className="mb-3">
          Dont have account?{" "}
          <Link
            to="/signup"
            className="underline font-semibold hover:text-black/[0.6] "
          >
            Signup
          </Link>
        </h1>
        <button
          type="submit"
          className={`w-full p-2 text-white  rounded-md hover:bg-black/[0.7] active:bg-black/[0.5] ${loading ? 'bg-stone-600': 'bg-black '}`}
          onClick={handleSubmit}
        >
          {loading ? "Loading" : "Submit"}
        </button>
        
      </form>
      <div className="px-3">
      <hr className="my-3 border border-black/[0.2] border-dashed"/>
      <button
        type="submit"
        className={`w-full p-2 text-white  rounded-md hover:bg-green-600 active:bg-green-700 ${loading ? 'bg-stone-600': 'bg-black '}`}
        onClick={guestUser}
      >
          Guest User
        </button>
      </div>
      
    </div>
  )
}

export default SigninPage