import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignupPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [loading,setLoading] = useState(false)
  
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image, setImage] = useState(
      "https://www.pngitem.com/pimgs/m/579-5798505_user-placeholder-svg-hd-png-download.png"
    );
    const navigate = useNavigate()
  
    useEffect(()=>{
      const user = localStorage.getItem('userInfo')
      if(user){
        navigate('/')
        toast.success('User already signed in',{
          position:"top-center"
        })
      }
    },[])

    const fetchNewImage = async () => {
      try {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const response = await fetch(`https://avatar.iran.liara.run/public/${randomNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const url = await response.url 
        setImage(url);
      } catch (error) {
        console.error("Error fetching new image:", error);
      }
    };
  
    useEffect(() => {
      fetchNewImage();
    }, []);
  
    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prevState) => !prevState);
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };


    const handleSubmit = async(e) =>{
      e.preventDefault()
      if(!name || !email || !password || !image){
        toast.error("All fields are required", {
          position: "top-center",
        });
        return;
      }

      if(!isValidEmail(email)){
        toast.error("Please enter a valid email address", {
          position: "top-center",
        });
        return;
      }

      const {data} = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user`,{name,email,password,image})
      if(data){
        // console.log(data)
        setName("")
        setEmail("")
        setPassword("")
        toast.success("Signup Sucessful.!!",{
          position:"top-center"
        })
        navigate('/signin')
      }else{
        toast.error("Signup failed",{
          position:"top-center"
        })
      }
    }
  
  return (
    <div>
        {/* <img src={ChatLogo} alt="" className=''/> */}
        <div className="w-3/4 md:w-1/2 lg:w-1/4 mx-auto border border-black/[0.2] rounded-lg mt-8">
      <h1 className="text-2xl text-center my-2 font-medium">Signup</h1>
      <form
        onSubmit={handleSubmit}
        className="p-3"
        encType="multipart/form-data"
      >
        <div className="mb-3 mx-auto w-1/3">
          <div className="w-16 h-16 mx-auto">
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1
            onClick={fetchNewImage}
            className="mt-1 text-sm text-center cursor-pointer hover:underline"
          >
            Change Avatar
          </h1>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="w-full px-2 py-1 text-lg border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
          />
        </div>
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
            to="/signin"
            className="underline font-semibold hover:text-black/[0.5]"
          >
            Signin
          </Link>
        </h1>
        <button
          type="submit"
          className={`w-full p-2 text-white rounded-md hover:bg-black/[0.7] active:bg-black/[0.5] ${loading ? 'bg-black/[0.2] text-black': 'bg-black '}`}
        //   disabled={loading}
        >
          {loading ? "Loading" : "Submit"}
        </button>
      </form>
    </div>
    </div>
  )
}

export default SignupPage