import { UserIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import ContentView from '../messages/ContentView';
import FileView from '../messages/FileView';
import ImageView from '../messages/ImageView';

interface ViewProps {
    message: any;
}

export default function HumanChatView(props: ViewProps) {
    const { message } = props;
    return (
        <>
            <div className="flex items-center gap-2 max-w-[90%] self-end flex-row-reverse">
                <div className="rounded-full self-start mt-1 p-2 bg-red-500 shadow-md border-4 border-red-200">
                    <UserIcon className="h-5 w-5 stroke-white" />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-end">
                        <label>{message.name}</label>{' '}
                        <label className=" text-xs ml-2">
                            {moment(message.time).format('MM-DD HH:mm')}
                        </label>
                    </div>
                    <div className="bg-white px-3 py-2 rounded-xl shadow">
                        {message.content.type == 'text' && (
                            <ContentView content={message.content.text} />
                        )}
                        {message.content.type == 'image' && (
                            <ImageView content={message.content.content} />
                        )}
                        {message.content.type == 'file' && (
                            <FileView
                                fileURL={message.content.fileURL}
                                fileName={message.content.fileName}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
