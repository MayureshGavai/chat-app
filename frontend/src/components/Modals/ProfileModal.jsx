import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import { IoAdd, IoClose } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileModal({className}) {
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
          className={`${className}`}
        //   className={`rounded-md p-1 text-sm font-medium ${
        //     themeMode === "light" ? "text-black" : "text-white"
        //   } `}
        >
          Profile
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
                      Profile Info
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
