import { useEffect, useState } from "react";
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import axios from "axios";

export const useFetchChats = () => {
  const { user, chats, setChats } = useChatContext();
  const [loading, setLoading] = useState(false);
  const [chatResults,setChatResults] = useState([])

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const userInfo = user || JSON.parse(localStorage.getItem("userInfo"));
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = res.data;
        setChats(data);
        setChatResults(chats)
      } catch (error) {
        toast.error(error.message, {
          position: "top-center",
        });
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  });

  return { loading, chatResults };
};
