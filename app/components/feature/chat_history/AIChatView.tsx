import Api from '@/app/apis';
import useAlert from '@/hooks/useAlert';
import { DocumentTextIcon } from '@heroicons/react/20/solid';
import { AcademicCapIcon, CloudArrowUpIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ChainFeatureList from '../../chain_feature/ChainFeatureList';
import Dropdowns from '../../common/Dropdowns';
import ContentEditor from '../../export/ContentEditor';
import RecommendButton from '../button/RecommendButton';
import ContentView from '../messages/ContentView';
import DocumentView from '../messages/DocumentView';
import FileLabelVerifyView from '../messages/FileLabelVerifyView';
import ImageView from '../messages/ImageView';
import SearchResultView from '../messages/SearchResultView';

interface ViewProps {
    position: number;
    message: any;
    cacheChatHistory: any;
    setResponseUploadData: any;
    setIsResponseUploadConfirmed: any;
    setChatHistory: any;
    getAllLabelsData?: any;
    chain_feature_ids?: any;
    handleSaveContent?: any;
}
const apiSetting = new Api();
export default function AIChatView(props: ViewProps) {
    const {
        position,
        message,
        cacheChatHistory,
        setResponseUploadData,
        setIsResponseUploadConfirmed,
        setChatHistory,
        getAllLabelsData,
        chain_feature_ids,
        handleSaveContent
    } = props;
    const { setAlert } = useAlert();
    const [openEdit, setOpenEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [current_chain_feature_ids, set_current_chain_feature_ids] = useState([]);
    function receiveMessageFromChainFeature(event: any) {
        if (
            event != undefined &&
            event.data?.from == 'chain_feature' &&
            event.data?.type == 'export'
        ) {
            console.log('AIChatView 收到信息：', event.data);
            const message = event.data;
            switch (message.type) {
                case 'export':
                    setResponseUploadData({
                        content: message.content || '',
                        filename: message?.filename
                    });
                    setIsResponseUploadConfirmed(true);
                    setChatHistory((prev: any) => {
                        let a = prev;
                        a[position].uploaded = true;
                        return [...a];
                    });
                    setOpenEdit(false);
                    break;
            }
        }
    }
    useEffect(() => {
        //监听来自chain feature run完事件
        window.addEventListener('message', receiveMessageFromChainFeature, false);
    }, []);

    return (
        <>
            <div className="flex items-center gap-2 max-w-[90%] group  ">
                <div className="rounded-full self-start mt-1 p-2 bg-blue-600 shadow-md border-4 border-blue-300">
                    <AcademicCapIcon className="h-5 w-5 stroke-white" />
                </div>
                <div>
                    <div className="flex flex-col">
                        <div>
                            <label>{message.name}</label>{' '}
                            <label className="text-xs ml-2">
                                {moment(message.time).format('MM-DD HH:mm')}
                            </label>
                        </div>
                        <div className="flex flex-row items-center">
                            <div
                                className={` text-white rounded-xl rounded-tl-none  ${
                                    message?.extra ? '' : 'bg-blue-500 px-3 py-2 shadow'
                                } `}
                            >
                                {message.content.type == 'text' && (
                                    <ContentView content={message.content.text} />
                                )}
                                {message.content.type == 'search' && (
                                    <SearchResultView
                                        search_result={message.content.search_result}
                                    />
                                )}
                                {message.content.type == 'document' && (
                                    <DocumentView document={message.content.document} />
                                )}
                                {message.content.type == 'file_label' && (
                                    <FileLabelVerifyView
                                        getAllLabelsData={message.content.getAllLabelsData}
                                        prediction={message.content.prediction}
                                        label={message.content.tag}
                                        isVerify={message.content.verify}
                                        updateMessage={(tag: any, verify: boolean) => {
                                            setChatHistory((prev: any) => {
                                                let a = prev;
                                                a[position].content.verify = verify;
                                                a[position].content.tag = tag;
                                                return [...a];
                                            });
                                        }}
                                    />
                                )}
                                {message.content.type == 'infographic' && (
                                    <ImageView content={message.content.url} />
                                )}
                            </div>
                            <div className="ml-2 ">
                                {message.content.type == 'text' && (
                                    <Dropdowns
                                        copyContent={message.content.text}
                                        showEdit={message.edit}
                                        edit={() => {
                                            setOpenEdit(true);
                                        }}
                                        show_chain_feature={true}
                                        chain_feature={() => {
                                            set_current_chain_feature_ids(chain_feature_ids);
                                            setOpen(true);
                                        }}
                                        showSave={message.edit}
                                        save={() => {
                                            handleSaveContent(message);
                                        }}
                                    />
                                )}
                                {message.content.type == 'search' &&
                                    message.content.search_result.meta.total_count > 0 && (
                                        <Dropdowns
                                            show_chain_feature={true}
                                            chain_feature={() => {
                                                set_current_chain_feature_ids(
                                                    message.content.search_result.values
                                                        .chain_feature_ids
                                                );
                                                setOpen(true);
                                            }}
                                        />
                                    )}

                                {message.content.type == 'document' && (
                                    <Dropdowns
                                        show_chain_feature={true}
                                        chain_feature={() => {
                                            set_current_chain_feature_ids(chain_feature_ids);
                                            setOpen(true);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        {message.edit && (
                            <div className="flex flex-row items-center mt-2 hidden">
                                <div
                                    className={`p-2 rounded-full border flex flex-row bg-white items-center ${
                                        message.uploaded
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'cursor-pointer text-inherit'
                                    }`}
                                    onClick={() => {
                                        if (message.uploaded) return;
                                        setOpenEdit(true);
                                    }}
                                >
                                    <PencilSquareIcon className="h-6 w-6" />
                                    <label className=" text-sm">編輯</label>
                                </div>
                                <RecommendButton
                                    visible={true}
                                    style={'ml-2'}
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                />
                                <div
                                    className={`p-2 ml-2 hidden rounded-full border bg-white items-center ${
                                        message.uploaded
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'cursor-pointer text-inherit'
                                    }`}
                                    onClick={() => {
                                        if (message.uploaded) return;
                                        setAlert({
                                            title: '儲存回應',
                                            type: 'info',
                                            content: (
                                                <div className="border rounded-lg overflow-hidden flex items-center">
                                                    <DocumentTextIcon className="h-5 w-5 m-2 text-gray-400" />
                                                    <input
                                                        className="border-l px-3 py-2 bg-white outline-none flex-grow h-full"
                                                        placeholder="文件名稱"
                                                        onChange={(e) => {
                                                            console.log(
                                                                'message.content',
                                                                message.content?.props?.content
                                                            );

                                                            setResponseUploadData({
                                                                content:
                                                                    message.content?.props
                                                                        ?.content || '',
                                                                filename: e.target.value
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            ),
                                            confirmText: '儲存',
                                            cancelText: '取消',
                                            setConfirmation: (value) => {
                                                console.log('value', value);

                                                if (value) {
                                                    setIsResponseUploadConfirmed(value);
                                                    setChatHistory((prev: any) => {
                                                        let a = prev;
                                                        a[position].uploaded = true;
                                                        return [...a];
                                                    });
                                                }
                                            }
                                        });
                                    }}
                                >
                                    <CloudArrowUpIcon className="h-6 w-6" />
                                    <label className=" text-sm">儲存</label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {openEdit && (
                <ContentEditor
                    content={message.content?.text}
                    open={openEdit}
                    setOpen={setOpenEdit}
                />
            )}
            {open && (
                <ChainFeatureList
                    title={'推薦功能 >...> 選擇功能'}
                    open={open}
                    setOpen={setOpen}
                    chain_feature_ids={current_chain_feature_ids}
                    selectContent={message.content?.text}
                    selectDocument={message.content.document}
                />
            )}
        </>
    );
}
