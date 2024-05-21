import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import { IoAdd, IoClose } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import { FiInfo } from "react-icons/fi";
import { useChatContext } from "../../context/ChatContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function GroupModal({ fetchAgain, setFetchAgain }) {
  let [isOpen, setIsOpen] = useState(false);
  const { themeMode } = useTheme();
  const { user, selectedChat, setSelectedChat } = useChatContext();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  console.log(selectedChat)

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/search?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = res.data;
      setSearchResult(data);
    } catch (err) {
      toast.error(err.message, {
        position: "top-center",
      });
    }
  };

  const deleteUser = (delId) => {
    setSelectedUser(selectedUser.filter((user) => user._id !== delId));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast.warn("User is already added", {
        position: "top-center",
      });
      return;
    }
    setSelectedChat([...selectedUser, userToAdd]);
  };

  return (
    <>
      <div className="flex items-center justify-center ">
        <button
          type="button"
          onClick={openModal}
          className={`rounded-md p-1 text-sm font-medium ${
            themeMode === "light" ? "text-black" : "text-white"
          } `}
        >
          <FiInfo className="text-2xl" />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full max-w-md transform overflow-hidden rounded-2xl ${
                    themeMode === "light"
                      ? "bg-white"
                      : "bg-gray-900 text-white"
                  } p-6 text-left font-Inter align-middle shadow-xl transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    <div className="flex justify-between items-center">
                      {selectedChat.chatName} Group Info
                      <button
                        className="bg-red-500 p-0.5 rounded-full text-white"
                        onClick={closeModal}
                      >
                        <IoClose />
                      </button>
                    </div>
                  </Dialog.Title>

                  {/* Dialog Content */}
                  <div className="mt-4">
                    <div className="flex ">
                      <input
                        type="text"
                        onChange={(e) => setGroupChatName(e.target.value)}
                        placeholder="Enter group name"
                        className="w-full bg-transparent border rounded-md px-2 py-1 dark:text-white dark:border-gray-600 "
                      />
                      <button
                        className={`ml-2 px-3 py-1.5 rounded-md ${
                          themeMode === "light"
                            ? "bg-gray-900 text-white"
                            : "text-gray-900 bg-white"
                        } `}
                      >
                        Update
                      </button>
                    </div>
                    <div className="mt-4 w-full flex flex-col mb-2">
                      <div className="flex gap-2 items-center">
                        {selectedChat?.users?.map((user) => {
                          return (
                            <div
                              key={user._id}
                              className={`my-2 w-fit flex items-center px-2 py-1 text-sm rounded-md border ${
                                themeMode === "light"
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-900 bg-white"
                              }`}
                            >
                              <h1 className="capitalize">{user.name}</h1>
                              <button
                                className="ml-1"
                                onClick={() => deleteUser(user._id)}
                              >
                                <IoClose />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <label htmlFor="" className="text-sm my-1 ">
                        Add Group Participants
                      </label>
                      <input
                        type="text"
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Enter participants names"
                        className="bg-transparent border rounded-md px-2 py-1 dark:text-white dark:border-gray-600 "
                      />
                      {searchResult?.users?.slice(0, 4).map((user) => {
                        return (
                          <div
                            key={user._id}
                            className="my-2 p-2 flex items-center rounded-md cursor-pointer border dark:border-gray-600 dark:text-white"
                          >
                            <img
                              src={user.image}
                              alt=""
                              className="w-12 h-12 mr-4"
                            />
                            <div
                              className="flex flex-col"
                              onClick={() => handleGroup(user)}
                            >
                              <h1 className="text-lg capitalize">
                                {user.name}
                              </h1>
                              <h1 className="text-sm">mail : {user.email}</h1>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
