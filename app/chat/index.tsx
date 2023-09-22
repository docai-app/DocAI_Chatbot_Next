import useAlert from '@/hooks/useAlert';
import { DocumentTextIcon, FolderIcon } from '@heroicons/react/20/solid';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import useAxios from 'axios-hooks';
import { convert } from 'html-to-text';
import _ from 'lodash';
import moment from 'moment';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Api from '../apis';
import ChatHistoryRow from '../components/feature/chat_history/ChatHistoryRow';
import InputField from '../components/InputField';
import HeaderView from './headerView';

export type Mode = 'QA' | 'FeatureHub' | 'UploadFile';

export interface Conversation {
    by: 'ai' | 'human';
    name: string;
    time: string;
    content: any;
    uploaded?: boolean;
    edit?: boolean;
    extra?: boolean;
}
const apiSetting = new Api();
export default function ChatView(props: any) {
    const dummyRef = useRef<HTMLDivElement>(null);

    const { setAlert } = useAlert();
    const [chatbotData, setChatbotData] = useState<any>();

    const [writing, setWriting] = useState(false);
    const [chatHistory, setChatHistory] = useState<Conversation[]>([]);
    const [chain_feature_ids, set_chain_feature_ids] = useState<any>([]);
    const [cacheChatHistory, setCacheChatHistory] = useState<
        ({ human: string } | { ai: string })[]
    >([]);
    const [mode, setMode] = useState<Mode>('QA');
    const [target_folder_id, set_target_folder_id] = useState('');

    // State for saving AI responses
    const [responseUploadData, setResponseUploadData] = useState({
        filename: '',
        content: ''
    });
    const [isResponseUploadConfirmed, setIsResponseUploadConfirmed] = useState(false);

    // States for uploading documents
    const [isFileConfirmed, setIsFileConfirmed] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    const [
        {
            data: uploadGeneratedContentData,
            loading: uploadGeneratedContentLoading,
            error: uploadGeneratedContentError
        },
        uploadGeneratedContent
    ] = useAxios(apiSetting.Storage.upload_generated_content(), { manual: true });

    const [{ data: assistantMessageData, loading: assistantMessageDataing }, assistantMessag] =
        useAxios(apiSetting.Chatbot.assistant_message(), { manual: true });

    const [{ data: uploadChatbotData, loading: uploadChatbotDataing }, uploadChatbot] = useAxios(
        apiSetting.Storage.upload_chatbot(),
        { manual: true }
    );

    const [{ data: getAllLabelsData, error: getAllLabelsError }, getAllLabels] = useAxios(
        apiSetting.Tag.getAllTags(),
        { manual: true }
    );

    const [{ data: updateDocumentTagData }, updateDocumentTag] = useAxios(
        apiSetting.Classification.updateDocumentTag([], ''),
        { manual: true }
    );

    useEffect(() => {
        getAllLabels();
    }, []);

    useEffect(() => {
        if (props?.chatbotData) {
            setChatbotData(props?.chatbotData);
        }
    }, [props]);

    useEffect(() => {
        if (chatbotData) {
            // window.localStorage?.removeItem('chatHistory_by_' + chatbotData.chatbot?.id)
            const tmp = window.localStorage?.getItem(
                'chatHistory_by_' +
                    chatbotData.chatbot?.id +
                    '_' +
                    window.localStorage?.getItem('authorization')
            );
            if (tmp) {
                const arr: Conversation[] = JSON.parse(tmp);
                setChatHistory(arr);
            } else {
                setChatHistory([]);
            }
            // console.log('chatbotData', chatbotData);
            if (chatbotData.chatbot?.meta?.chain_features) {
                set_chain_feature_ids(chatbotData.chatbot?.meta?.chain_features);
            }
            if (chatbotData?.chatbot) {
                setIsPublic(chatbotData?.chatbot?.is_public);
            }
            if (chatbotData?.folders && chatbotData?.folders[0]) {
                set_target_folder_id(chatbotData?.folders[0].id);
            }
        }
    }, [chatbotData]);

    const handleFileInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files || [];
            setFile(files[0]);
            setAlert({
                title: '確認文件名稱',
                type: 'info',
                content: (
                    <>
                        <div className="border rounded-lg overflow-hidden flex items-center">
                            <DocumentTextIcon className="h-5 w-5 m-2 text-gray-400" />
                            <input
                                className="border-l px-3 py-2 bg-white outline-none flex-grow h-full"
                                defaultValue={files[0].name}
                                onChange={(e) =>
                                    setFile((file) => {
                                        if (!file) return file;
                                        return new File([file], e.target.value, {
                                            ...file
                                        });
                                    })
                                }
                            />
                        </div>
                        <div className="border rounded-lg overflow-hidden flex items-center my-2">
                            <FolderIcon className="h-5 w-5 m-2 text-gray-400" />
                            <select
                                id="select_tag"
                                name="location"
                                className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={
                                    (!_.isEmpty(chatbotData?.folders) &&
                                        chatbotData?.folders[0].id) ||
                                    ''
                                }
                                onChange={(e) => {
                                    // console.log(e.target.value);
                                    set_target_folder_id(e.target.value);
                                }}
                            >
                                <option value="" disabled>
                                    請選擇文件夾
                                </option>
                                {chatbotData?.folders?.map((folder: any, index: number) => {
                                    return (
                                        <option key={index} value={folder?.id}>
                                            {folder?.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </>
                ),
                confirmText: '確認',
                cancelText: '取消',
                setConfirmation: setIsFileConfirmed
            });
        },
        [chatbotData, setIsFileConfirmed, setFile]
    );

    const handleSaveContent = useCallback(
        (message: any) => {
            setAlert({
                title: '儲存回應',
                type: 'info',
                content: (
                    <>
                        <div className="border rounded-lg overflow-hidden flex items-center">
                            <DocumentTextIcon className="h-5 w-5 m-2 text-gray-400" />
                            <input
                                className="border-l px-3 py-2 bg-white outline-none flex-grow h-full"
                                placeholder="文件名稱"
                                onChange={(e) => {
                                    // console.log('message.content', message.content?.text);
                                    setResponseUploadData({
                                        content: message.content?.text || '',
                                        filename: e.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="border rounded-lg overflow-hidden flex items-center my-2">
                            <FolderIcon className="h-5 w-5 m-2 text-gray-400" />
                            <select
                                id="select_tag"
                                name="location"
                                className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={
                                    (!_.isEmpty(chatbotData?.folders) &&
                                        chatbotData?.folders[0].id) ||
                                    ''
                                }
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    set_target_folder_id(e.target.value);
                                }}
                            >
                                <option value="" disabled>
                                    請選擇文件夾
                                </option>
                                {chatbotData?.folders?.map((folder: any, index: number) => {
                                    return (
                                        <option key={index} value={folder?.id}>
                                            {folder?.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </>
                ),
                confirmText: '儲存',
                cancelText: '取消',
                setConfirmation: (value) => {
                    if (value) {
                        setIsResponseUploadConfirmed(value);
                    }
                }
            });
        },
        [chatbotData]
    );
    useEffect(() => {
        if (isFileConfirmed && file) {
            // console.log(file);
            const fileURL = URL.createObjectURL(file);
            if (file.type.startsWith('image/')) {
                newMessage('human', {
                    type: 'image',
                    content: fileURL
                });
            } else {
                newMessage('human', {
                    type: 'file',
                    fileURL: fileURL,
                    fileName: file.name
                });
            }
            setWriting(true);
            setIsFileConfirmed(false);
            const data = new FormData();
            data.append('file', file);
            data.append('chatbot_id', chatbotData?.chatbot?.id);
            data.append('target_folder_id', target_folder_id);

            uploadChatbot({
                ...apiSetting.Storage.upload_chatbot(),
                data: data
            }).then((res) => {
                setWriting(false);
                if (res.data.success) {
                    // console.log(res.data);
                    newMessage(
                        'ai',
                        {
                            type: 'file_label',
                            getAllLabelsData: getAllLabelsData,
                            prediction: res.data.prediction
                        },
                        false,
                        true
                    );
                } else {
                    console.log(res.data);
                }
            });
        }
    }, [isFileConfirmed, file, setWriting]);

    const newMessage = (by: 'ai' | 'human', content: any, edit = true, extra?: boolean) => {
        const message = {
            by,
            name: by == 'ai' ? chatbotData?.chatbot?.name : '',
            time: moment().format('YYYY-MM-DD HH:mm'),
            content,
            edit,
            extra
        };
        setChatHistory((prev) => [...prev, message]);
        // console.log(content);
        // console.log('chatbotData', chatbotData);

        let tmp: any = window.localStorage?.getItem(
            'chatHistory_by_' +
                chatbotData?.chatbot?.id +
                '_' +
                window.localStorage?.getItem('authorization')
        );
        let messags: any = [];
        if (tmp && !_.isEmpty(tmp)) {
            messags = JSON.parse(tmp);
        }
        messags.push(message);
        window.localStorage?.setItem(
            'chatHistory_by_' +
                chatbotData?.chatbot?.id +
                '_' +
                window.localStorage?.getItem('authorization'),
            JSON.stringify(messags)
        );
    };

    const sendMessage = useCallback(
        async (content: string) => {
            if (!chatbotData?.chatbot?.id) return;
            newMessage('human', { type: 'text', text: content });
            setWriting(true);
            // console.log('cacheChatHistory', cacheChatHistory);

            const res = await assistantMessag({
                ...apiSetting.Chatbot.assistant_message(),
                data: {
                    id: chatbotData?.chatbot?.id,
                    query: content,
                    chat_history: cacheChatHistory
                }
            });
            if (res.data?.success) {
                // console.log('chat_history', res.data.message.chat_history);
                setCacheChatHistory(res.data.message.chat_history);
                newMessage('ai', { type: 'text', text: res.data.message.content }, !isPublic);
            } else {
                console.log(res.data);
            }
            setWriting(false);
        },
        [chatbotData?.chatbot?.id, cacheChatHistory, isPublic, chatbotData]
    );

    useEffect(() => {
        if (chatHistory && chatbotData) {
            // console.log('chatHistory', chatHistory);
            window.localStorage?.setItem(
                'chatHistory_by_' +
                    chatbotData.chatbot?.id +
                    '_' +
                    window.localStorage?.getItem('authorization'),
                JSON.stringify(chatHistory)
            );
        }
    }, [chatHistory]);

    const handleUpdateDocumentTag = (document_ids: [], tag_id: string) => {
        updateDocumentTag({
            data: {
                document_ids: [document_ids],
                tag_id: tag_id
            }
        });
    };

    useEffect(() => {
        if (isResponseUploadConfirmed) {
            // console.log('folder id', chatbotData.folders[0].id);
            // console.log('responseUploadData', responseUploadData);

            newMessage('human', {
                type: 'text',
                text: '幫我儲存以下內容: \n' + convert(responseUploadData.content)
            });
            setWriting(true);
            uploadGeneratedContent({
                data: {
                    ...responseUploadData,
                    target_folder_id: target_folder_id
                }
            }).then((res) => {
                // console.log(res);
                setWriting(false);
                setIsResponseUploadConfirmed(false);
                if (res.data.success) {
                    console.log(res.data);

                    const document = res.data.document;
                    newMessage('ai', { type: 'text', text: '成功儲存!' }, false);
                    newMessage(
                        'ai',
                        {
                            type: 'document',
                            document: document
                            // chain_feature_ids: chain_feature_ids
                        },
                        false
                    );
                }
            });
        }
    }, [isResponseUploadConfirmed]);

    useEffect(() => {
        dummyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    //回调函数
    const receiveMessageFromIndex = useCallback(
        (event: any) => {
            if (event != undefined && event.data?.from == 'chain_feature') {
                // console.log('收到信息：', event.data);
                const message = event.data;
                switch (message.type) {
                    case 'input':
                        newMessage(
                            'ai',
                            { type: 'text', text: `請輸入"${message.block?.name}"` },
                            false
                        );
                        newMessage('human', { type: 'text', text: message.content });
                        setCacheChatHistory((prev) => [
                            ...prev,
                            { ai: message.block?.name },
                            { human: message.content }
                        ]);
                        break;
                    case 'output':
                        newMessage('ai', { type: 'text', text: message.content }, !isPublic);
                        setCacheChatHistory((prev) => [...prev, { ai: message.content }]);
                        break;
                    case 'file':
                        const file = message.content;
                        const fileURL = URL.createObjectURL(file);
                        newMessage(
                            'ai',
                            { type: 'text', text: `請輸入"${message.block?.name}"` },
                            false
                        );
                        // setCacheChatHistory((prev) => [...prev, { 'ai': `請輸入"${message.block?.name}"` }]);
                        newMessage('human', {
                            type: 'file',
                            fileURL: fileURL,
                            fileName: file.name
                        });
                        break;
                    case 'document':
                        const document = message.content;
                        newMessage(
                            'ai',
                            { type: 'text', text: `請輸入"${message.block?.name}"` },
                            false
                        );
                        // setCacheChatHistory((prev) => [...prev, { 'ai': `請輸入"${message.block?.name}"` }]);
                        newMessage('human', {
                            type: 'file',
                            fileURL: document.storage_url,
                            fileName: document.name
                        });
                        break;
                    case 'infographic':
                        newMessage('human', { type: 'text', text: '幫我生成信息圖' });
                        // setCacheChatHistory((prev) => [...prev, { 'ai': "幫我生成信息圖" }]);
                        newMessage(
                            'ai',
                            {
                                type: 'infographic',
                                url: message.content
                            },
                            false,
                            true
                        );
                        break;
                    case 'finish':
                        setOpen(false);
                        break;
                }
            }
        },
        [isPublic, chatbotData]
    );

    //监听来自chain feature run完事件
    useEffect(() => {
        window.addEventListener('message', receiveMessageFromIndex, false);
        return () => {
            window.removeEventListener('message', receiveMessageFromIndex, false);
        };
    }, [isPublic, chatbotData]);

    const handleStartSearch = (search_content: any) => {
        setWriting(true);
        let content = '請給我';
        if (search_content?.content) {
            content += `有"${search_content?.content}"的`;
        }
        content += `"${search_content?.tag_name}"的文檔. `;
        if (search_content?.from) {
            content += `起始日期是: ${search_content?.from},`;
        }
        if (search_content?.to) {
            content += `結束日期是${search_content?.to}.`;
        }
        newMessage('human', { type: 'text', text: content });
    };
    const handleSearchResult = (search_result: any) => {
        setWriting(false);
        console.log(search_result);
        if (search_result?.success) {
            newMessage(
                'ai',
                {
                    type: 'search',
                    search_result: search_result
                },
                false,
                true
            );
        } else {
            newMessage('ai', { type: 'text', text: '查詢失敗,請重試!' }, false);
        }
    };
    return (
        <>
            <HeaderView
                chatbotData={chatbotData}
                showChatbotLoading={false}
                setChatHistory={setChatHistory}
                setOpenMenu={props.setOpenMenu}
            />
            <main className="wallpapers flex flex-col items-start gap-3 p-3  overflow-auto mb-auto h-full bg-[#eff7fe]">
                {chatHistory && chatHistory.length == 0 && (
                    <div className="flex w-full h-full justify-center items-center flex-col">
                        <img src="/assets/images/chat/chat.png" alt="" />
                        <div>
                            <p className="text-gray-500">No Message</p>
                        </div>
                    </div>
                )}
                {chatHistory?.map((message, index) => {
                    return (
                        <ChatHistoryRow
                            key={index}
                            position={index}
                            message={message}
                            cacheChatHistory={cacheChatHistory}
                            setChatHistory={setChatHistory}
                            setIsResponseUploadConfirmed={setIsResponseUploadConfirmed}
                            setResponseUploadData={setResponseUploadData}
                            getAllLabelsData={getAllLabelsData}
                            handleUpdateDocumentTag={handleUpdateDocumentTag}
                            chain_feature_ids={chain_feature_ids}
                            handleSaveContent={handleSaveContent}
                        />
                    );
                })}
                {writing && (
                    <div className="flex items-center gap-2 max-w-[85%]">
                        <div className="rounded-full self-start mt-1 p-2 bg-blue-600 shadow-md border-4 border-blue-300">
                            <AcademicCapIcon className="h-5 w-5 stroke-white" />
                        </div>
                        <div className="bg-white px-3 py-2 rounded-xl shadow">...</div>
                    </div>
                )}
                <div ref={dummyRef}></div>
            </main>
            <InputField
                {...{
                    mode,
                    setMode,
                    writing,
                    setWriting,
                    sendMessage,
                    handleFileInputChange,
                    chain_feature_ids,
                    open,
                    setOpen,
                    chatbotData,
                    getAllLabelsData,
                    handleStartSearch,
                    handleSearchResult,
                    handleUpdateDocumentTag
                }}
            />
        </>
    );
}
