import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Tab } from "@headlessui/react";
import { IoAdd, IoClose } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import AllUsers from "../AllUsers";
import CreateGroup from "../CreateGroup";

export default function AddModal() {
  const { themeMode } = useTheme();
  let [isOpen, setIsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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
          <IoAdd className="text-3xl" />
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
                      Start Conversation
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
                    <Tab.Group>
                      <Tab.List className="grid grid-cols-2 ">
                        <Tab
                          className={`${
                            activeTab === 1
                              ? themeMode === "light"
                                ? "bg-gray-900 text-white"
                                : "bg-white text-black"
                              : themeMode === "light"
                              ? "bg-gray-300 text-black"
                              : "bg-gray-700 text-white"
                          } py-1 px-4  rounded-l-md`}
                          onClick={() => handleTabClick(1)}
                        >
                          New Conversation
                        </Tab>
                        <Tab
                          className={`${
                            activeTab === 2
                              ? themeMode === "light"
                                ? "bg-gray-900 text-white"
                                : "bg-white text-black"
                              : themeMode === "light"
                              ? "bg-gray-300 text-black"
                              : "bg-gray-700 text-white"
                          } py-2 px-4 mr-2 rounded-r-md`}
                          onClick={() => handleTabClick(2)}
                        >
                          Create Group
                        </Tab>
                      </Tab.List>
                      <Tab.Panels className="mt-1 p-2">
                        <Tab.Panel>
                          <AllUsers closeModal={()=>closeModal}/>
                        </Tab.Panel>
                        <Tab.Panel>
                          <CreateGroup/>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
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
