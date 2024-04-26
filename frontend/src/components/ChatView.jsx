import React from "react";
import { useTheme } from "../context/ThemeContext";
import { MdArrowBack } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";


const ChatView = () => {
  const { themeMode } = useTheme();
  const {setSelectedUser} = useChatContext()

  return (
    <div
      className={` border-r h-screen ${
        themeMode === "dark" ? "dark" : "light"
      } `}
    >
      <div className="dark:text-white dark:bg-gray-900 h-full">
        <div className="w-full px-4 py-3 shadow-sm flex justify-between items-center dark:border-b dark:border-gray-600">
            <MdArrowBack className="text-2xl"/>
        </div>
      </div>
      ChatView
    </div>
  );
};

export default ChatView;
