import React, { Fragment, useEffect, useState } from "react";
import ChatLogo from "../assets/ChatLogo.png";
import DarkChatLogo from "../assets/DarkChatLogo.png";
import { useChatContext } from "../context/ChatContext";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { Menu, Transition } from "@headlessui/react";
import { useTheme } from "../context/ThemeContext";
import AddModal from "./Modals/AddModal";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
// import ProfileModal from './Modals/AddModal';

const ChatList = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useChatContext();
  const { themeMode, toggleTheme } = useTheme();
  const [chatLoading, setChatLoading] = useState(false);
  console.log(chats);

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const fetchChats = async () => {
    setChatLoading(true);
    try {
      const userInfo = user || JSON.parse(localStorage.getItem("userInfo"));
      const res = await axios.get("http://localhost:3000/api/chat", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = res.data;
      setChats(data);
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
      });
      console.error(error.message);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  // const signoutHandle = () => {

  // }

  return (
    <div
      className={` border-r h-screen ${
        themeMode === "dark" ? "dark" : "light"
      } `}
    >
      <div className="dark:text-white dark:bg-gray-900 h-full">
        <div className="w-full px-4 py-3 shadow-sm flex justify-between items-center dark:border-b dark:border-gray-600">
          <img
            src={themeMode === "light" ? ChatLogo : DarkChatLogo}
            alt=""
            className="w-8 h-8"
          />
          <Menu
            as="div"
            className="relative inline-block text-left dark:bg-black-900 dark:text-white"
          >
            <div className="p-0 m-0 w-8 h-8">
              <Menu.Button className=" inline-flex items-center relative rounded-full hover:shadow-lg">
                <img
                  src={user?.image}
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-900 dark:ring-white/[0.5] shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-gray-200 dark:bg-gray-500 dark:text-white "
                              : "text-gray-900 dark:text-white"
                          } 
                    group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={toggleTheme}
                        >
                          {themeMode === "light" ? "Dark" : "Light"} Theme
                        </button>
                      )}
                    </Menu.Item>
                  </div>

                  {/* <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? "bg-gray-200 dark:bg-gray-500 dark:text-white " : "text-gray-900 dark:text-white"} 
                    group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <ProfileModal/>
                      </button>
                    )}
                  </Menu.Item>
                </div> */}

                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-gray-200 dark:bg-gray-500 dark:text-white "
                              : "text-gray-900 dark:text-white"
                          } 
                    group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          // onClick={handleSignout}
                        >
                          {/* {loading ? "Loading" : "Signout"} */}
                          Signout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="my-3 px-4 flex justify-between items-center">
          <input
            type="text"
            className="w-full mr-2 px-2 py-1 border rounded-md bg-transparent dark:text-white dark:border-gray-600"
            placeholder="Search"
          />
          <AddModal />
        </div>
        <div className="my-3 px-4">
          {chatLoading ? (
            <div className=" flex items-start justify-center">
              <TailSpin
                visible={true}
                height="50"
                width="50"
                color="#2563EB"
                ariaLabel="tail-spin-loading"
                radius="10"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : (
            chats?.map((chat) => {
              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`my-2 px-3 py-2 border dark:border-gray-600 rounded-md flex items-center cursor-pointer ${selectedChat === chat ? "bg-gray-900 text-white dark:bg-white dark:text-black" : ""}`}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtRimL0VOuLLbDPzsk26k5frEfhPZlcvIFkTHepPuqXA&s"
                    alt=""
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <h1 className="capitalize">
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </h1>
                </div>
              );
            })
          )}
          {/* {
                chats?.map(chat => {
                    return <div key={chat._id} className='my-2 px-3 py-2 border dark:border-gray-600 rounded-md flex items-center '>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtRimL0VOuLLbDPzsk26k5frEfhPZlcvIFkTHepPuqXA&s" alt="" className='w-10 h-10 rounded-full mr-3'/>
                        <h1>{chat.chatName}</h1>
                    </div>
                })
            } */}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
