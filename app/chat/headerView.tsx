import { FolderIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import ChatbotSetting from '../components/common/ChatbotSetting';

interface ViewProps {
    chatbotData: any;
    showChatbotLoading: boolean;
    setChatHistory: any;
    setOpenMenu: any;
}

export default function HeaderView(props: ViewProps) {
    const { chatbotData, showChatbotLoading, setChatHistory, setOpenMenu } = props;
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="bg-white min-h-[4rem] flex items-center px-4 border-b">
                {chatbotData && (
                    <div
                        className="bg-[#eff7fe] sm:hidden rounded-full p-2 mr-2 cursor-pointer"
                        onClick={() => {
                            // setOpen(true)
                            setOpenMenu(true);
                        }}
                    >
                        <ListBulletIcon className="w-5 h-5 text-blue-500" />
                    </div>
                )}
                <div className="flex flex-col justify-center">
                    <div className="text-lg">
                        {showChatbotLoading ? '載入中...' : chatbotData?.chatbot?.name}
                    </div>
                    <div className="text-xs text-gray-500">{chatbotData?.chatbot?.description}</div>
                </div>
                <div className="ml-auto">
                    {chatbotData?.folders?.map((folder: any) => (
                        <div className="text-sm flex gap-2 items-center" key={folder.id}>
                            <FolderIcon className="h-5 w-5 text-blue-100" />
                            <div className="text-sm text-gray-400">{folder.name}</div>
                        </div>
                    ))}
                </div>
                {chatbotData && (
                    <div
                        className="bg-[#eff7fe] rounded-full p-2 ml-4 cursor-pointer"
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        <Squares2X2Icon className="w-5 h-5 text-blue-500" />
                    </div>
                )}
            </div>
            {/* <ChatbotList open={open} setOpen={setOpen} chatbotData={chatbotData} setChatHistory={setChatHistory} /> */}
            <ChatbotSetting
                open={open}
                setOpen={setOpen}
                chatbotData={chatbotData}
                setChatHistory={setChatHistory}
            />
        </>
    );
}
