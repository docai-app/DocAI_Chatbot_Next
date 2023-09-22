import Api from '@/app/apis';
import { useEffect, useRef, useState } from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import ChainFeatureListView from '../chain_feature/ChainFeatureListView';
import DocumentListView from './DocumentListView';

interface ViewProps {
    open: boolean;
    setOpen: any;
    search_result: any;
    isRecommend?: boolean;
}

const apiSetting = new Api();

export default function DocumentList(props: ViewProps) {
    const { open, setOpen, search_result, isRecommend } = props;

    const sheetRef = useRef<BottomSheetRef>(null);
    const [maxHeight, setMaxHeight] = useState(500);
    const [openDocuments, setOpenDocuments] = useState(true);
    const [openChainFeature, setOpenChainFeature] = useState(false);
    const [showIframe, setShowIframe] = useState(false);
    const [selectDocument, setSelectDocument] = useState<any>();
    const [title, setTitle] = useState('推薦功能 > 選擇文檔');
    const [chain_feature_ids, set_chain_feature_ids] = useState<any>([]);

    useEffect(() => {
        setMaxHeight(document.body.offsetHeight * 0.8);
        setSelectDocument(null);
    }, []);

    useEffect(() => {
        if (search_result?.values?.chain_feature_ids)
            set_chain_feature_ids(search_result?.values?.chain_feature_ids || []);
    }, [search_result]);

    const renderHeader = () => {
        return (
            <div className="w-full  relative items-center">
                <label className=" absolute right-0 cursor-pointer" onClick={close}>
                    {'Close'}
                </label>
                <label>查詢結果</label>
            </div>
        );
    };

    const renderHeaderRecommend = () => {
        return (
            <div className="w-full  relative items-center">
                {!showBack() && (
                    <label className=" absolute left-0 cursor-pointer" onClick={close}>
                        {'Close'}
                    </label>
                )}
                {showBack() && (
                    <label className=" absolute left-0 cursor-pointer" onClick={back}>
                        {'<'}
                    </label>
                )}
                <label>{title}</label>
                {showNext() && (
                    <label className=" absolute right-0 cursor-pointer" onClick={next}>
                        {'Next'}
                    </label>
                )}
            </div>
        );
    };

    const close = () => {
        setTitle('推薦功能 > 選擇文檔');
        setOpen(false);
        setOpenDocuments(true);
        setOpenChainFeature(false);
        setSelectDocument(null);
    };

    const back = () => {
        setTitle('推薦功能 > 選擇文檔');
        setOpenDocuments(true);
        setOpenChainFeature(false);
        setShowIframe(false);
        setSelectDocument(null);
    };
    const showBack = () => {
        return openChainFeature;
    };

    const showNext = () => {
        return openDocuments && selectDocument;
    };

    const next = () => {
        setTitle('推薦功能 >...> 選擇功能');
        setOpenDocuments(false);
        setOpenChainFeature(true);
        setShowIframe(false);
    };

    const handleShowIframe = (showIframe: boolean) => {
        setShowIframe(showIframe);
        setTitle('推薦功能');
    };

    //回调函数
    function receiveMessageFromIndex(event: any) {
        if (event != undefined && event.data?.from == 'chain_feature') {
            const message = event.data;
            switch (message.type) {
                case 'finish':
                    close();
                    break;
            }
        }
    }

    // useEffect(() => {
    //     //监听来自chain feature run完事件
    //     window.addEventListener("message", receiveMessageFromIndex, false);
    // }, [])

    //监听来自chain feature run完事件
    useEffect(() => {
        window.addEventListener('message', receiveMessageFromIndex, false);
        return () => {
            window.removeEventListener('message', receiveMessageFromIndex, false);
        };
    }, []);

    return (
        <>
            <BottomSheet
                open={open}
                ref={sheetRef}
                onDismiss={() => {
                    close();
                }}
                maxHeight={maxHeight}
                header={isRecommend ? renderHeaderRecommend() : renderHeader()}
            >
                {openDocuments && (
                    <DocumentListView
                        search_result={search_result}
                        isRecommend={isRecommend}
                        setSelectDocument={setSelectDocument}
                    />
                )}

                {openChainFeature && (
                    <ChainFeatureListView
                        showIframe={showIframe}
                        setShowIframe={handleShowIframe}
                        chain_feature_ids={chain_feature_ids}
                        selectDocument={selectDocument}
                    />
                )}
            </BottomSheet>
        </>
    );
}
