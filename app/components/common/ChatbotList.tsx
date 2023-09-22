import Api from '@/app/apis';
import { Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';

interface Props {
    open: boolean;
    setOpen: any;
    chatbotData: any;
    setChatHistory: any;
}

const apiSetting = new Api();
export default function ChatbotList(props: Props) {
    const { open, setOpen, chatbotData, setChatHistory } = props;
    return (
        <Transition show={open}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div
                    className="fixed inset-0 bg-black/30"
                    aria-hidden="true"
                    onClick={() => {
                        setOpen(false);
                    }}
                />
            </Transition.Child>
            <Transition.Child
                as={Fragment}
                enter="translate ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="translate ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
            >
                <div className="fixed h-[calc(100vh)] shadow-lg left-0 top-0 w-[80%] sm:w-[28rem] bg-white z-50">
                    <XCircleIcon
                        className="w-6 h-6 absolute right-5 top-5"
                        onClick={() => {
                            setOpen(false);
                        }}
                    />
                    <div className="w-full h-full flex flex-col py-2">
                        <div className="px-8 py-2  flex flex-0 flex-col items-left justify-start ">
                            <h1 className="font-bold text-xl sm:text-2xl text-left ">
                                {chatbotData?.chatbot?.name}
                            </h1>
                            <h1 className="text-gray-500 text-md sm:text-sm text-left ">
                                {chatbotData?.chatbot?.description}
                            </h1>
                        </div>
                        <div className="pl-2 pr-5 pb-5 flex-1 overflow-auto"></div>

                        <div className="px-5 flex flex-0 justify-center">
                            <button
                                className=" px-3 py-2 bg-red-600 text-white rounded-md"
                                onClick={() => {
                                    setChatHistory([]);
                                    window.localStorage?.removeItem(
                                        'chatHistory_by_' + chatbotData.chatbot?.id
                                    );
                                }}
                            >
                                清除聊天記錄
                            </button>
                        </div>
                    </div>
                </div>
            </Transition.Child>
        </Transition>
    );
}
