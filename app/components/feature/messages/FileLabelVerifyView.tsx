import Api from '@/app/apis';
import useAlert from '@/hooks/useAlert';
import { TagIcon } from '@heroicons/react/24/outline';
import useAxios from 'axios-hooks';
import { useState } from 'react';

interface ViewProps {
    getAllLabelsData: any;
    prediction: any;
    updateMessage: any;
    label?: any;
    isVerify?: boolean;
}
const apiSetting = new Api();
export default function FileLabelVerifyView(props: ViewProps) {
    const { getAllLabelsData, prediction, updateMessage, label, isVerify } = props;
    const { setAlert } = useAlert();
    const [verify, setVerify] = useState(isVerify);
    const [tag, setTag] = useState<any>(label);

    const [{ data: updateDocumentTagData }, updateDocumentTag] = useAxios(
        apiSetting.Classification.updateDocumentTag([], ''),
        { manual: true }
    );

    const handleConfirmTag = () => {
        updateMessage(prediction.label, true);
        handleUpdateDocumentTag(prediction?.document?.id, prediction?.label?.id);
        setVerify(true);
    };

    const handleUpdateDocumentTag = (document_ids: string, tag_id: string) => {
        updateDocumentTag({
            data: {
                document_ids: [document_ids],
                tag_id: tag_id
            }
        });
    };

    const handleCancelTag = () => {
        let tag: any = {};
        setAlert({
            title: '選擇現有的類型',
            type: 'info',
            content: (
                <div className="rounded-lg overflow-hidden flex items-center">
                    <TagIcon className="h-5 w-5 m-2 text-gray-400" />
                    <select
                        id="select_tag"
                        name="location"
                        className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue=""
                        onChange={(e) => {
                            tag = JSON.parse(e.target.value);
                        }}
                    >
                        <option value="" disabled>
                            請選擇類別
                        </option>
                        {getAllLabelsData?.tags?.map((tag: any, index: number) => {
                            return (
                                <option key={index} value={JSON.stringify(tag)}>
                                    {tag.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            ),
            confirmText: '確定',
            cancelText: '取消',
            setConfirmation: (value) => {
                console.log('value', value);
                if (!value) return;
                if (!tag?.id) return;
                setVerify(true);
                setTag(tag);
                updateMessage(tag, true);
                // handleUpdateDocumentTag(prediction?.document?.id, tag?.id)
            }
        });
    };

    return (
        <>
            <div className="bg-blue-500 rounded-xl rounded-tl-none p-2  shadow relative">
                <span className="text-sm">
                    我認為這個文件是{' '}
                    <label className="text-md font-bold">
                        {tag?.name || prediction.label.name}
                    </label>
                </span>
            </div>
            {!verify && (
                <div className="mt-2">
                    <p className="text-black">分類是否正確？</p>
                    <div className="flex flex-row ">
                        <button
                            className="flex-1 rounded-md text-md border py-1 bg-green-500 hover:bg-green-700 text-white "
                            onClick={handleConfirmTag}
                        >
                            Yes
                        </button>
                        <button
                            className="flex-1 rounded-md ml-1 text-md border py-1 bg-red-500 hover:bg-red-700  text-white"
                            onClick={handleCancelTag}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
