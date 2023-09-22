import { FolderIcon } from '@heroicons/react/20/solid';

interface ViewProps {
    chatbotData: any;
    showChatbotLoading: boolean;
}

export default function HeaderView(props: ViewProps) {
    const { chatbotData, showChatbotLoading } = props;
    return (
        <>
            <div className="bg-white min-h-[4rem] flex items-center px-4 border-b">
                <div className="flex flex-col justify-center">
                    <div className="text-lg">
                        {showChatbotLoading ? '載入中...' : chatbotData?.chatbot?.name}
                    </div>
                    <div className="text-xs text-gray-500">{chatbotData?.chatbot?.description}</div>
                </div>
                <div className="ml-auto">
                    {chatbotData?.folders?.map((folder: any) => (
                        <div className="text-sm flex gap-2 items-center" key={folder.id}>
                            <FolderIcon className="h-5 w-5 text-blue-100" />
                            <div className="text-sm text-gray-400">{folder.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
