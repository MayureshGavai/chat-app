import React, { Fragment, useEffect, useState } from "react";
import ChatLogo from "../assets/ChatLogo.png";
import DarkChatLogo from "../assets/DarkChatLogo.png";
import DefaultAvatar from "../assets/DefaultAvatar.jpg"
import { useChatContext } from "../context/ChatContext";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { Menu, Transition } from "@headlessui/react";
import { useTheme } from "../context/ThemeContext";
import AddModal from "./Modals/AddModal";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const ChatList = ({ fetchAgain }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat } = useChatContext();
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useTheme();
  const [chatLoading, setChatLoading] = useState(false);
  const [searchQuery,setSearchQuery] = useState("")

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser._id ? users[1] : users[0];
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
      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      // toast.error(error.message, {
      //   position: "top-center",
      // });
      console.error(error.message);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const signoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/signin");
    toast.success("Signout Successful.!!", {
      position: "top-center",
    });
  };

  const filteredChats = chats.filter(chat => {
    if (chat.isGroupChat) {
      return chat.chatName.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      const sender = getSender(user, chat.users);
      return sender?.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  return (
    <div
      className={` border-r h-screen ${
        themeMode === "dark" ? "dark" : "light"
      } `}
    >
      <div className="dark:text-white dark:bg-gray-900 h-full flex flex-col">
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
              <Menu.Button className="inline-flex items-center relative rounded-full hover:shadow-lg">
                {
                  user?.image ? (
                    <img
                    src={user?.image ? user.image : DefaultAvatar}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                  ):(<img
                  src={DefaultAvatar}
                  alt=""
                  className="w-full h-full object-cover rounded-full"
                />) 
                }
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
                              ? "bg-gray-200 dark:bg-gray-500 dark:text-white"
                              : "text-gray-900 dark:text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={toggleTheme}
                        >
                          {themeMode === "light" ? "Dark" : "Light"} Theme
                        </button>
                      )}
                    </Menu.Item>
                  </div>

                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-gray-200 dark:bg-gray-500 dark:text-white"
                              : "text-gray-900 dark:text-white"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          onClick={signoutHandler}
                        >
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
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            className="w-full mr-2 px-2 py-1 border rounded-md bg-transparent dark:text-white dark:border-gray-600"
            placeholder="Search"
          />
          <AddModal />
        </div>
        <div className="flex-grow overflow-y-auto px-4">
  {chatLoading ? (
    <div className="flex items-start justify-center">
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
    <>
      {filteredChats.length === 0 && (
        <div className="text-center text-gray-500 italic mt-4">
          No chat found
        </div>
      )}

      {filteredChats.length === 0 && chats.length === 0 && (
        <div className="text-center text-gray-500 italic mt-4">
          Start a conversation by selecting users to chat
        </div>
      )}

      {Array.isArray(filteredChats) && filteredChats?.map((chat) => (
        <div
          key={chat?._id}
          onClick={() => setSelectedChat(chat)}
          className={`my-2 px-3 py-2 border dark:border-gray-600 rounded-md flex items-center cursor-pointer ${
            selectedChat === chat
              ? "bg-gray-900 text-white dark:bg-white dark:text-black"
              : ""
          }`}
        >
          {chat.isGroupChat ? (
            <div className="flex -space-x-7 mr-3">
              <img
                src="https://avatar.iran.liara.run/public/60"
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <img
                src="https://avatar.iran.liara.run/public/25"
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <img
                src={chat.groupAdmin.image}
                className="w-10 h-10 rounded-full"
                alt=""
              />
            </div>
          ) : (
            <img
              src={getSender(user, chat.users)?.image ? getSender(user, chat.users).image : DefaultAvatar}
              alt=""
              className="w-10 h-10 rounded-full mr-3"
            />
          )}
          <div className="flex flex-col">
            <h1 className="capitalize font-medium">
              {!chat.isGroupChat
                ? getSender(user, chat.users)?.name
                : chat.chatName}
            </h1>
            <h1 className="text-xs truncate">{chat?.latestMessage?.content}</h1>
          </div>
        </div>
      ))}
    </>
  )}
</div>

      </div>
    </div>
  );
};

export default ChatList;
