'use client';
import { AlertProvider } from '@/contexts/AlertContext';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import ChatView from './chat';
import AlertModal from './components/AlertModal';
import Initializer from './components/Initializer';
import Sidebar from './components/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//     title: "DocAI Demo",
//     description: "",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [currectChatbot, setCurrectChatbot] = useState();
    const [openMenu, setOpenMenu] = useState(false);
    return (
        <html lang="zh-TW">
            <body className={inter.className}>
                <Initializer />
                <AlertProvider>
                    <div className="flex items-center justify-center w-full h-full px-0 md:px-0">
                        <div className="grid grid-cols-12 h-full w-full border bg-white   overflow-hidden">
                            <div
                                className={`${
                                    openMenu ? 'col-span-12' : 'hidden md:block col-span-3'
                                } `}
                            >
                                <Sidebar
                                    currectChatbot={currectChatbot}
                                    setCurrectChatbot={setCurrectChatbot}
                                    setOpenMenu={setOpenMenu}
                                />
                            </div>
                            <div className="col-span-full md:col-span-9 flex flex-col overflow-hidden ">
                                {/* {children} */}
                                <ChatView chatbotData={currectChatbot} setOpenMenu={setOpenMenu} />
                            </div>
                        </div>
                    </div>
                    <AlertModal />
                </AlertProvider>
            </body>
        </html>
    );
}
