import React, { useState } from "react";
import ChatList from "../components/ChatList";
import { useChatContext } from "../context/ChatContext";
import ChatView from "../components/ChatView";

const HomePage = () => {
  const { selectedChat } = useChatContext();
  const [fetchAgain, setFetchAgain] = useState(false);
  
  return (
    <div className="w-full flex flex-col lg:flex-row h-screen">
      {/* ChatList */}
      <div className={`lg:w-1/4 ${selectedChat ? "hidden lg:block" : "block"}`}>
        <ChatList fetchAgain={fetchAgain} />
      </div>

      {/* ChatView */}
      <div className={`lg:w-3/4 ${selectedChat ? "w-full" : "hidden lg:block"} `}>
        <ChatView fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default HomePage;
