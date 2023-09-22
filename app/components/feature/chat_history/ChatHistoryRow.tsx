import useAlert from '@/hooks/useAlert';
import { Fragment, useState } from 'react';
import AIChatView from './AIChatView';
import HumanChatView from './HumanChatView';

interface ViewProps {
    message: any;
    position: number;
    cacheChatHistory: any;
    setResponseUploadData: any;
    setIsResponseUploadConfirmed: any;
    setChatHistory: any;
    getAllLabelsData?: any;
    handleUpdateDocumentTag: any;
    chain_feature_ids?: any;
    handleSaveContent?: any;
}

export default function ChatHistoryRow(props: ViewProps) {
    const {
        message,
        position,
        cacheChatHistory,
        setResponseUploadData,
        setIsResponseUploadConfirmed,
        setChatHistory,
        getAllLabelsData,
        handleUpdateDocumentTag,
        chain_feature_ids,
        handleSaveContent
    } = props;
    const [open, setOpen] = useState(false);
    const { setAlert } = useAlert();
    return (
        <>
            <Fragment key={position}>
                {message.by === 'ai' && (
                    <AIChatView
                        position={position}
                        message={message}
                        cacheChatHistory={cacheChatHistory}
                        setResponseUploadData={setResponseUploadData}
                        setChatHistory={setChatHistory}
                        setIsResponseUploadConfirmed={setIsResponseUploadConfirmed}
                        getAllLabelsData={getAllLabelsData}
                        chain_feature_ids={chain_feature_ids}
                        handleSaveContent={handleSaveContent}
                    />
                )}
                {message.by === 'human' && <HumanChatView message={message} />}
            </Fragment>
        </>
    );
}
