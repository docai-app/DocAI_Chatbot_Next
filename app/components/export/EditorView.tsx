import { useEffect, useRef } from 'react';
import 'react-spring-bottom-sheet/dist/style.css';
import TinymceEditor from './TinymceEditor';

interface ViewProps {
    content: string;
    setEditContent: any;
}

export default function EditorView(props: ViewProps) {
    const { content, setEditContent } = props;
    const editorRef = useRef();

    useEffect(() => {
        if (editorRef.current) {
            console.log(editorRef.current);
        }
    }, [editorRef]);
    const getContent = () => {
        console.log(editorRef.current);

        if (editorRef.current) return (editorRef.current as any).content;
        else {
            return content;
        }
    };

    return (
        <>
            <TinymceEditor ref={editorRef} content={content} setContent={setEditContent} />
        </>
    );
}
