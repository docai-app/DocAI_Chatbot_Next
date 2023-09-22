'use client';
import useAlert from '@/hooks/useAlert';
import initializeAxios from '@/utils/initializeAxios';
import { decrypt } from '@/utils/util_crypto';
import { DocumentTextIcon, FolderIcon } from '@heroicons/react/20/solid';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import useAxios from 'axios-hooks';
import { convert } from 'html-to-text';
import _ from 'lodash';
import moment from 'moment';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Api from '../apis';
import ChatHistoryRow from '../components/feature/chat_history/ChatHistoryRow';
import FileLabelVerifyView from '../components/feature/messages/FileLabelVerifyView';
import FileResultView from '../components/feature/messages/FileResultView';
import ImageView from '../components/feature/messages/ImageView';
import SearchResultView from '../components/feature/messages/SearchResultView';
import InputField from '../components/InputField';
import MessageBox from '../components/MessageBox';
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
export default function Chat({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams?: { token: string };
}) {
    const dummyRef = useRef<HTMLDivElement>(null);

    const { setAlert } = useAlert();

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
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [isFileConfirmed, setIsFileConfirmed] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [openDocumentList, setOpenDocumentList] = useState(false);
    const [search_result, set_search_result] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    // Main states
    const [{ data: chatbotData, loading: showChatbotLoading }, getChatbot] = useAxios(
        apiSetting.Chatbot.chatbots(params.id),
        { manual: true }
    );

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
        const token = searchParams?.token || '';
        const decryptedText = decrypt(token);
        if (decryptedText) window.localStorage?.setItem('authorization', decryptedText);

        initializeAxios(decryptedText || '');
        const localStorage_token = window.localStorage?.getItem('authorization');

        if (params.id && localStorage_token) {
            getChatbot();
            getAllLabels();
        }
        // setBackgroundWallpaperGradients("grediant-3")
    }, [params, searchParams]);

    useEffect(() => {
        if (chatbotData && chatbotData.success) {
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

    useEffect(() => {
        if (isFileConfirmed && file) {
            // console.log(file);
            const fileURL = URL.createObjectURL(file);
            if (file.type.startsWith('image/')) {
                newMessage(
                    'human',
                    <div
                        className="flex gap-3 items-center cursor-pointer"
                        onClick={() =>
                            setAlert({
                                title: 'Preview',
                                content: <img src={fileURL} />
                            })
                        }
                    >
                        <DocumentTextIcon className="h-6 w-6" />
                        <div className="text-gray-500">{file.name}</div>
                    </div>
                );
            } else {
                newMessage(
                    'human',
                    <a
                        className="flex gap-3 items-center"
                        href={fileURL}
                        target="_blank"
                        rel="noopener"
                    >
                        <DocumentTextIcon className="h-6 w-6" />
                        <div className="text-gray-500">{file.name}</div>
                    </a>
                );
            }
            setWriting(true);
            setIsFileConfirmed(false);
            const data = new FormData();
            data.append('file', file);
            data.append('chatbot_id', params.id);
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
                        <FileLabelVerifyView
                            getAllLabelsData={getAllLabelsData}
                            prediction={res.data.prediction}
                            updateMessage={undefined}
                        />,
                        false,
                        true
                    );
                } else {
                    console.log(res.data);
                }
            });
        }
    }, [isFileConfirmed, file, params, setWriting]);

    const newMessage = useCallback(
        (by: 'ai' | 'human', content: any, edit = true, extra?: boolean) => {
            setChatHistory((prev) => [
                ...prev,
                {
                    by,
                    name: by == 'ai' ? chatbotData?.chatbot?.name : '',
                    time: moment().format('YYYY-MM-DD HH:mm'),
                    content,
                    edit,
                    extra
                }
            ]);
            setShowUploadPopup(true);
        },
        [chatHistory, chatbotData]
    );

    const sendMessage = useCallback(
        async (content: string) => {
            if (!params.id) return;
            newMessage('human', <MessageBox content={content} />);
            setWriting(true);
            // console.log('cacheChatHistory', cacheChatHistory);

            const res = await assistantMessag({
                ...apiSetting.Chatbot.assistant_message(),
                data: {
                    id: params.id,
                    query: content,
                    chat_history: cacheChatHistory
                }
            });
            if (res.data?.success) {
                // console.log('chat_history', res.data.message.chat_history);

                setCacheChatHistory(res.data.message.chat_history);
                newMessage('ai', <MessageBox content={res.data.message.content} />, !isPublic);
            } else {
                console.log(res.data);
            }
            setWriting(false);
        },
        [params.id, cacheChatHistory, isPublic, chatbotData]
        // [params.id, chatHistory, cacheChatHistory, axios]
    );

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
            newMessage(
                'human',
                <MessageBox
                    content={'幫我儲存以下內容: \n' + convert(responseUploadData.content)}
                />
            );
            uploadGeneratedContent({
                data: {
                    ...responseUploadData,
                    target_folder_id: target_folder_id
                }
            }).then((res) => {
                // console.log(res);
                setIsResponseUploadConfirmed(false);
                if (res.data.success) {
                    const document = res.data.document;
                    newMessage('ai', '成功儲存!', false);
                    newMessage(
                        'ai',
                        <FileResultView
                            document={document}
                            chain_feature_ids={chain_feature_ids}
                        />,
                        false,
                        true
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
                            <MessageBox content={`請輸入"${message.block?.name}"`} />,
                            false
                        );
                        newMessage('human', <MessageBox content={message.content} />);
                        setCacheChatHistory((prev) => [
                            ...prev,
                            { ai: message.block?.name },
                            { human: message.content }
                        ]);
                        break;
                    case 'output':
                        newMessage('ai', <MessageBox content={message.content} />, !isPublic);
                        setCacheChatHistory((prev) => [...prev, { ai: message.content }]);
                        break;
                    case 'file':
                        const file = message.content;
                        const fileURL = URL.createObjectURL(file);
                        newMessage(
                            'ai',
                            <MessageBox content={`請輸入"${message.block?.name}"`} />,
                            false
                        );
                        newMessage(
                            'human',
                            <a className="flex gap-3 items-center" href={fileURL}>
                                <DocumentTextIcon className="h-6 w-6" />
                                <div className="text-gray-500">{file.name}</div>
                            </a>
                        );
                        break;
                    case 'document':
                        const document = message.content;
                        newMessage(
                            'ai',
                            <MessageBox content={`請輸入"${message.block?.name}"`} />,
                            false
                        );
                        newMessage(
                            'human',
                            <a className="flex gap-3 items-center" href={document.storage_url}>
                                <DocumentTextIcon className="h-6 w-6" />
                                <div className="text-gray-500">{document.name}</div>
                            </a>
                        );
                        break;
                    case 'infographic':
                        newMessage('human', <MessageBox content={'幫我生成信息圖'} />);
                        newMessage('ai', <ImageView content={message.content} />, false);
                        break;
                    case 'finish':
                        setOpen(false);
                        break;
                }
            }
        },
        [isPublic]
    );

    //监听来自chain feature run完事件
    useEffect(() => {
        window.addEventListener('message', receiveMessageFromIndex, false);
        return () => {
            window.removeEventListener('message', receiveMessageFromIndex, false);
        };
    }, [isPublic]);

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
        newMessage('human', <MessageBox content={content} />);
    };
    const handleSearchResult = (search_result: any) => {
        // console.log('search_result', search_result);
        setWriting(false);
        if (search_result?.success) {
            newMessage(
                'ai',
                <SearchResultView
                    search_result={search_result}
                    set_search_result={set_search_result}
                />,
                false,
                true
            );
        } else {
            newMessage('ai', '查詢失敗,請重試!', false);
        }
    };

    if (!params.id) return;
    return (
        <>
            <HeaderView chatbotData={chatbotData} showChatbotLoading={showChatbotLoading} />
            <main className="wallpapers flex flex-col items-start gap-3 p-3 relative overflow-auto mb-auto h-full bg-[#eff7fe]">
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
            {/* <DocumentList
                open={openDocumentList}
                setOpen={setOpenDocumentList}
                search_result={search_result}
            /> */}
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
