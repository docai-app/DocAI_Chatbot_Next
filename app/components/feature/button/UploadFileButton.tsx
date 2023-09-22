import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useCallback, useRef } from 'react';

interface ViewProps {
    visible: boolean;
    handleFileInputChange: any;
    disabled: boolean;
}

export default function UploadFileButton(props: ViewProps) {
    const { visible = false, disabled, handleFileInputChange } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleUploadButtonClick = useCallback(
        (e: any) => {
            e.preventDefault();
            if (!fileInputRef.current) return;
            fileInputRef.current.click();
        },
        [fileInputRef]
    );

    return (
        <div className={`${visible ? '' : 'hidden'}`}>
            <button
                onClick={handleUploadButtonClick}
                className={`rounded-lg text-sm p-2 ${
                    disabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white'
                } flex justify-center  ring-0 shadow-lg mx-1`}
                disabled={disabled}
            >
                <ArrowUpTrayIcon className="h-5 w-5" />
                {/* <span>Choose a file</span> */}
            </button>
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                onClick={(e) => {
                    e.currentTarget.value = '';
                }}
            />
        </div>
    );
}
