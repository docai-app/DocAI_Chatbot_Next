import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import SearchView from '../../search';

interface ViewProps {
    visible: boolean;
    disabled: boolean;
    getAllLabelsData: any;
    chatbotData: any;
    handleStartSearch?: any;
    handleSearchResult?: any;
}

export default function SearchButton(props: ViewProps) {
    const {
        visible = false,
        disabled,
        chatbotData,
        getAllLabelsData,
        handleStartSearch,
        handleSearchResult
    } = props;
    const [open, setOpen] = useState(false);
    return (
        <div className={`${visible ? '' : 'hidden'}`}>
            <button
                onClick={() => {
                    setOpen(true);
                }}
                className={`rounded-lg text-sm p-2 ${
                    disabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white'
                } flex justify-center  ring-0 shadow-lg mx-1`}
                disabled={disabled}
            >
                <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <SearchView
                open={open}
                setOpen={setOpen}
                chatbotData={chatbotData}
                getAllLabelsData={getAllLabelsData}
                handleStartSearch={handleStartSearch}
                handleSearchResult={handleSearchResult}
            />
        </div>
    );
}
