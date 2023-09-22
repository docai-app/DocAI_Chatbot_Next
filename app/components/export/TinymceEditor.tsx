import { Editor } from '@tinymce/tinymce-react';
import { convert } from 'html-to-text';
import { forwardRef, useImperativeHandle, useRef } from 'react';
interface ViewProps {
    content: string;
    setContent?: any;

    setVisible?: any;
}

// eslint-disable-next-line react/display-name
const TinymceEditor = forwardRef((props: ViewProps, ref) => {
    const { content, setContent, setVisible } = props;

    const editorRef = useRef(null);
    const getContent = () => {
        if (editorRef.current) {
            return (editorRef.current as any).getContent();
        } else {
            return '';
        }
    };

    const getConvertContent = () => {
        if (editorRef.current) {
            return convert((editorRef.current as any).getContent());
        } else {
            return '';
        }
    };

    useImperativeHandle(ref, () => ({
        content: getContent(),
        convertContent: getConvertContent()
    }));

    const preview = () => {
        if (editorRef.current) {
            (editorRef.current as any).execCommand('mcePreview');
        }
    };

    return (
        <>
            <Editor
                id="output_editor"
                apiKey="g6v7lxx8s2baelpg69g81ei3jp7npb8bf1yv6hs8w8tp4422"
                onInit={(evt, editor) => ((editorRef.current as any) = editor)}
                initialValue={content}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'code',
                        'wordcount'
                    ],
                    toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat ',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={(a, editor) => {
                    console.log(a);
                    // setContent(a)
                    // editor.setContent(a)
                    if (setContent) {
                        setContent(a);
                    }
                }}
            />
        </>
    );
});

export default TinymceEditor;
