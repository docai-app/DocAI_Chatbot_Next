import { useEffect, useRef, useState } from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import IframeView from './IframeView';

interface ViewProps {
    content: string;
    open: boolean;
    setOpen: any;
}
const edit_url = process.env.NEXT_PUBLIC_AIADMIN_SERVER + `/chainfeature/export`;

export default function ContentEditor(props: ViewProps) {
    const { content, open, setOpen } = props;
    const sheetRef = useRef<BottomSheetRef>(null);
    const [maxHeight, setMaxHeight] = useState(500);
    const [editContent, setEditContent] = useState('');
    const editorRef = useRef();
    useEffect(() => {
        setMaxHeight(document.body.offsetHeight * 0.8);
        setEditContent(content);
    }, []);

    const renderHeader = () => {
        return (
            <div className="w-full  relative items-center">
                <label className=" absolute right-0 text-gray-500" onClick={back}>
                    {'關閉'}
                </label>
                {/* <label className=' absolute right-0 text-blue-500' onClick={save}>{'保存'}</label> */}
                <label>編輯</label>
            </div>
        );
    };

    const back = () => {
        setOpen(false);
        // if (editorRef.current) {
        //     (editorRef.current as any).execCommand('mcePreview');
        // }
    };
    const save = () => {
        // const content = getContent()
        console.log(editContent);
    };

    const getContent = () => {
        console.log(editorRef.current);

        if (editorRef.current) return (editorRef.current as any).content;
        else {
            return content;
        }
    };

    return (
        <>
            <BottomSheet
                open={open}
                ref={sheetRef}
                onDismiss={() => {
                    setOpen(false);
                }}
                maxHeight={maxHeight}
                header={renderHeader()}
            >
                <IframeView content={content} aiadmin_link={edit_url} />
            </BottomSheet>
        </>
    );
}
