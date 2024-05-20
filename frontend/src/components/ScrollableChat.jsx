import React, { useEffect, useRef } from 'react';
import { useChatContext } from '../context/ChatContext';

const ScrollableChat = ({ messages }) => {
  const { user } = useChatContext();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isLastMessage = (messages, i) => {
    return i === messages.length - 1 ||
      messages[i + 1].sender._id !== messages[i].sender._id;
  };

  return (
      <div className="p-3 overflow-y-auto h-full">
      {messages && messages.map((m, i) => (
        <div key={m._id} className={`w-full my-1.5 flex ${m.sender._id === user._id ? "justify-end" : "justify-start"}`}>
          <div>
            <h1 className={`px-3 py-1 ${m.sender._id === user._id ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-se-xl rounded-l-xl" : "bg-gray-300 dark:bg-gray-700 dark:text-white rounded-ss-xl rounded-r-xl"}`}>
              {m.content}
            </h1>
            {isLastMessage(messages, i) && (
              <span className={`text-xs mt-1 flex ${m.sender._id === user._id ? "justify-end" : "justify-start"}`}>
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ScrollableChat;
