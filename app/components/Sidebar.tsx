'use client';
import initializeAxios from '@/utils/initializeAxios';
import { decrypt } from '@/utils/util_crypto';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Api from '../apis';

const apiSetting = new Api();
export default function Sidebar(props: any) {
    const params = useParams();
    const searchParams = useSearchParams();
    const [chatbots, setChatbots] = useState([]);
    const [{ data, loading, error }, showAllChatbots] = useAxios(apiSetting.Chatbot.allChatbots(), {
        manual: true
    });

    useEffect(() => {
        const token = searchParams?.get('token') || '';
        const decryptedText = decrypt(token);
        if (decryptedText) window.localStorage?.setItem('authorization', decryptedText);

        initializeAxios(decryptedText || '');
        const localStorage_token = window.localStorage?.getItem('authorization');
        // console.log('searchParams', searchParams?.get('id'));
        // console.log('params', params.id);
        if (localStorage_token) showAllChatbots();
    }, [searchParams]);

    useEffect(() => {
        if (data && data.success) {
            setChatbots(data.chatbots);
        }
    }, [data]);

    useEffect(() => {
        if (chatbots) {
            const chatbot_id = params.id || searchParams?.get('id');
            if (chatbot_id) {
                const chatbot = _.find(chatbots, function (chat: any) {
                    return chat.chatbot?.id == chatbot_id;
                });
                props.setCurrectChatbot(chatbot);
            } else {
                props.setCurrectChatbot(chatbots[0]);
            }
        }
    }, [chatbots]);
    return (
        <div className="border-r h-[99vh] flex flex-col">
            <div className="flex-0 border-b h-16 bg-white flex items-center px-4 justify-between">
                <h2 className="font-bold text-2xl">DocAI智能助手</h2>
                <div
                    className="bg-[#eff7fe] rounded-full p-2 ml-4 cursor-pointer sm:hidden"
                    onClick={() => {
                        props.setOpenMenu(false);
                    }}
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex-1 flex-grow flex flex-col overflow-y-auto">
                {chatbots?.map((item: any) => (
                    // <Link
                    //     key={item.chatbot.id}
                    //     href={{ pathname: 'chat', query: { id: item.chatbot.id, token: searchParams?.get('token') } }}
                    //     className={`px-6 py-4 cursor-pointer ${item.chatbot.id === params.id ? "bg-[#eff7fe]   border-l-4  border-l-blue-500 " : "bg-white"
                    //         }`}
                    // >
                    //     <div className="font-medium text-md">{item.chatbot.name}</div>
                    //     <div className={`text-sm ${item.chatbot.id === params.id ? "text-blue-500 " : "text-gray-400 "}`}>
                    //         {item.chatbot.description || '暂无描述'}
                    //     </div>
                    // </Link>
                    <div
                        key={item.chatbot.id}
                        className={`px-6 py-4 cursor-pointer ${
                            item.chatbot.id === props?.currectChatbot?.chatbot?.id
                                ? 'bg-[#eff7fe]   border-l-4  border-l-blue-500 '
                                : 'bg-white'
                        }`}
                        onClick={() => {
                            props.setCurrectChatbot(item);
                            props.setOpenMenu(false);
                        }}
                    >
                        <div className="font-medium text-sm sm:text-md ">{item.chatbot.name}</div>
                        <div
                            className={`text-sm ${
                                item.chatbot.id === props?.currectChatbot?.chatbot?.id
                                    ? 'text-blue-500 '
                                    : 'text-gray-400 '
                            }`}
                        >
                            {item.chatbot.description || '暂无描述'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
