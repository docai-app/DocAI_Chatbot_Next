import { useEffect, useRef, useState } from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import ChainFeatureListView from './ChainFeatureListView';

interface ViewProps {
    chain_feature_ids?: any[];
    open: boolean;
    setOpen: any;
    title?: string;
    selectDocument?: any;
    selectContent?: any;
}

export default function ChainFeatureList(props: ViewProps) {
    const { chain_feature_ids, open, setOpen, title, selectDocument, selectContent } = props;
    const sheetRef = useRef<BottomSheetRef>(null);
    const [showIframe, setShowIframe] = useState(false);
    const [maxHeight, setMaxHeight] = useState(500);

    const renderHeader = () => {
        return (
            <div className="w-full  relative items-center">
                {showIframe && (
                    <label className=" absolute left-0" onClick={back}>
                        {'<返回'}
                    </label>
                )}
                <label>{title || 'Chain Feature'}</label>
            </div>
        );
    };
    const back = () => {
        setShowIframe(false);
    };

    //回调函数
    function receiveMessageFromIndex(event: any) {
        if (event != undefined && event.data?.from == 'chain_feature') {
            const message = event.data;
            switch (message.type) {
                case 'finish':
                    setShowIframe(false);
                    setOpen(false);
                    break;
            }
        }
    }
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
                    setShowIframe(false);
                    setOpen(false);
                }}
                maxHeight={maxHeight}
                header={renderHeader()}
            >
                <ChainFeatureListView
                    showIframe={showIframe}
                    setShowIframe={setShowIframe}
                    chain_feature_ids={chain_feature_ids}
                    selectDocument={selectDocument}
                    selectContent={selectContent}
                />
            </BottomSheet>
        </>
    );
}
