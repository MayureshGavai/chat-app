import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { MdArrowBack } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import ChatLogo from "../assets/ChatLogo.png";
import DarkChatLogo from "../assets/DarkChatLogo.png";
import { RiSendPlaneFill } from "react-icons/ri";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import GroupModal from "./Modals/GroupModal";
import ProfileModal from "./Modals/ProfileModal";
import { TailSpin } from "react-loader-spinner";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;
let socket, selectedChatCompare;

const ChatView = ({ fetchAgain, setFetchAgain }) => {
  const { themeMode } = useTheme();
  const { user, selectedChat, setSelectedChat } = useChatContext();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleBack = () => {
    setSelectedChat();
    setFetchAgain(true)
    navigate("/");
  };

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser._id ? users[1] : users[0];
  };

  const getUserStatus = (userId) => {
    return onlineUsers.has(userId) ? "Online" : "Offline";
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("user online", (userId) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on("user offline", (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // give notification
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true)
    try {
      const res = await axios.get(
        `http://localhost:3000/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = res.data;
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
      setLoading(false)
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/message",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = res.data;
      socket.emit("new message", data);
      setNewMessage("");
      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  return (
    <div
      className={`${
        themeMode === "dark" ? "dark" : "light"
      } dark:text-white dark:bg-gray-900`}
    >
      {selectedChat ? (
        <div className={`flex flex-col h-screen `}>
          <div className="h-14 dark:text-white dark:bg-gray-900">
            <div
              className={`w-full sticky top-0 z-10 px-4 py-3 shadow-sm flex items-center dark:border-b dark:border-gray-600 ${
                themeMode === "dark" ? "bg-gray-900" : "bg-white"
              }`}
            >
              <button onClick={handleBack} className="p-1">
                <MdArrowBack className="text-2xl" />
              </button>
              <div className="w-full flex justify-between items-center">
                <div className="ml-2 flex items-center">
                  {selectedChat.isGroupChat ? (
                    <div className="flex">
                      <img
                        src="https://avatar.iran.liara.run/public/60"
                        className="w-12 h-12 rounded-full"
                        alt=""
                      />
                      <img
                        src="https://avatar.iran.liara.run/public/25"
                        className="w-12 h-12 rounded-full"
                        alt=""
                      />
                      <img
                        src={selectedChat.groupAdmin.image}
                        className="w-12 h-12 rounded-full"
                        alt=""
                      />
                    </div>
                  ) : (
                    <img
                      src={getSender(user, selectedChat.users).image}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-col ml-4">
                    <h1 className="text-lg capitalize">
                      {!selectedChat.isGroupChat
                        ? getSender(user, selectedChat.users).name
                        : selectedChat.chatName}
                    </h1>
                    <h1 className="text-sm">
                      {/* {!selectedChat.isGroupChat
                        ? getUserStatus(getSender(user, selectedChat.users)._id)
                        : ""} */}
                    </h1>
                  </div>
                </div>
                <div className="flex justify-end">
                  {!selectedChat.isGroupChat ? (
                    <ProfileModal user={getSender(user, selectedChat.users)} />
                  ) : (
                    <GroupModal />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Part */}
          {
            loading ? (
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
            ) : messages.length === 0 ? (
              <div className={`p-3 flex flex-col flex-1 items-center justify-center dark:text-white ${
                themeMode === "dark" ? "bg-gray-900" : "bg-white"
                  }`}>
                <h1 className="text-6xl">👋</h1>
                <div className="text-lg mt-3 flex flex-col justify-center items-center"><h1>No messages yet.</h1><h1>Say something to get the chat started!</h1></div>
              </div>
            ) : (
              <div className={`p-3 flex-1 overflow-y-auto dark:text-white ${
              themeMode === "dark" ? "bg-gray-900" : "bg-white"
                }`}
              >
            <ScrollableChat messages={messages} />
          </div>    
            )
          }
          

          {/* Send Message Input */}
          <div className="relative h-14 px-3 py-4 flex items-center bg-white dark:bg-gray-900 dark:text-white border-t dark:dark:border-gray-600">
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-16">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-full flex">
              <button type="button" onClick={toggleEmojiPicker} className="mr-2">
                😀
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-5/6 px-2 py-1 rounded-md bg-transparent border"
                placeholder="Enter Message"
              />
              <button
                type="submit"
                className={`w-1/6 flex justify-center items-center mx-2 px-2 py-1 rounded-md ${
                  themeMode === "dark"
                    ? "bg-white text-black"
                    : "bg-gray-900 text-white"
                }`}
              >
                Send <RiSendPlaneFill className="ml-2 w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div
          className={`h-screen text-center flex flex-col justify-center items-center dark:bg-gray-900`}
        >
          <img
            src={themeMode === "light" ? ChatLogo : DarkChatLogo}
            className="mb-5 w-14 h-14"
            alt=""
          />
          <h1 className="text-xl dark:text-white">
            Dive into vibrant conversations and connect with others.
          </h1>
        </div>
      )}
    </div>
  );
};

export default ChatView;
