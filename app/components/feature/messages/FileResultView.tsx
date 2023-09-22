import { DocumentTextIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import ChainFeatureList from '../../chain_feature/ChainFeatureList';
import RecommendButton from '../button/RecommendButton';

interface ViewProps {
    document: any;
    chain_feature_ids: any;
}

export default function FileResultView(props: ViewProps) {
    const { document, chain_feature_ids } = props;

    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="bg-white p-2 rounded-xl shadow ">
                <a
                    className="flex gap-3 items-center"
                    target={'_blank'}
                    rel="noopener"
                    href={document.storage_url}
                >
                    <DocumentTextIcon className="h-6 w-6" />
                    <div className="text-gray-500">{document.name}</div>
                </a>
            </div>
            <RecommendButton
                visible={true}
                style={'mt-2'}
                onClick={() => {
                    setOpen(true);
                }}
            />

            <ChainFeatureList
                title={'推薦功能 >...> 選擇功能'}
                open={open}
                setOpen={setOpen}
                chain_feature_ids={chain_feature_ids}
                selectDocument={document}
            />
        </>
    );
}
