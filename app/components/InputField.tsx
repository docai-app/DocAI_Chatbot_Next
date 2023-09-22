import useAlert from '@/hooks/useAlert';
import {
    ChangeEventHandler,
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef
} from 'react';
import { Mode } from '../chat';
import ChainFeatureButton from './feature/button/ChainFeatureButton';
import SearchButton from './feature/button/SearchButton';
import SendMessageButton from './feature/button/SendMessageBotton';
import UploadFileButton from './feature/button/UploadFileButton';

interface InputFieldProps {
    mode: Mode;
    setMode: Dispatch<SetStateAction<Mode>>;
    writing: boolean;
    setWriting: Dispatch<SetStateAction<boolean>>;
    sendMessage: (content: string) => void;
    handleFileInputChange: ChangeEventHandler<HTMLInputElement>;
    chain_feature_ids?: any[];
    open: boolean;
    setOpen: any;
    chatbotData?: any;
    getAllLabelsData?: any;
    handleStartSearch?: any;
    handleSearchResult?: any;
}

export default function InputField({
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
    handleSearchResult
}: InputFieldProps) {
    const textInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setAlert } = useAlert();

    useEffect(() => {
        if (textInputRef.current == null) return;
        if (!writing) {
            textInputRef.current.focus();
        }
    }, [writing]);

    const handleSendText = useCallback(() => {
        if (textInputRef.current == null) return;
        const text = textInputRef.current.value;
        if (text?.trim() == '') {
            setAlert({ title: '提示', content: '請輸入內容' });
            return;
        }
        // setText(text);
        textInputRef.current.value = '';
        sendMessage(text);
        // to-do
    }, [sendMessage, textInputRef]);

    const showSearchButton = () => {
        return !chatbotData?.chatbot?.is_public;
    };

    const showChainFeatureButton = () => {
        return true;
    };

    const showUploadFileButton = () => {
        return !chatbotData?.chatbot?.is_public;
    };

    const showSendMessageButton = () => {
        return true;
    };

    const onKeyup = (e: any) => {
        if (e.keyCode === 13) {
            handleSendText();
        }
    };

    return (
        <>
            <div className="w-full p-2 flex items-center border-t bg-white" id="InputField">
                {mode === 'QA' && (
                    <div className="w-full flex flex-1 flex-row items-center ">
                        {/* <ReactTextareaAutosize
                            ref={textInputRef}
                            disabled={writing}
                            maxRows={4}
                            onKeyUp={onKeyup}
                            placeholder="Write your message..."
                            className="flex-grow self-end border resize-none px-3 py-2 rounded-lg min-h-full bg-white"
                        /> */}
                        <input
                            ref={textInputRef}
                            onKeyUp={onKeyup}
                            autoFocus={true}
                            disabled={writing}
                            placeholder="Write your message..."
                            className=" w-full border flex flex-1 resize-none px-2 py-2 rounded-lg  bg-white"
                        />
                        <div className="flex-0 flex">
                            <SearchButton
                                visible={showSearchButton()}
                                disabled={writing}
                                chatbotData={chatbotData}
                                getAllLabelsData={getAllLabelsData}
                                handleStartSearch={handleStartSearch}
                                handleSearchResult={handleSearchResult}
                            />

                            <ChainFeatureButton
                                visible={showChainFeatureButton()}
                                disabled={writing}
                                chain_feature_ids={chain_feature_ids}
                                open={open}
                                setOpen={setOpen}
                            />
                            <UploadFileButton
                                visible={showUploadFileButton()}
                                handleFileInputChange={handleFileInputChange}
                                disabled={writing}
                            />

                            <SendMessageButton
                                visible={showSendMessageButton()}
                                disabled={writing}
                                handleSendText={handleSendText}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
