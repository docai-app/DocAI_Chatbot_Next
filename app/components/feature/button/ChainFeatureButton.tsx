import { SparklesIcon } from '@heroicons/react/24/outline';
import ChainFeatureList from '../../chain_feature/ChainFeatureList';

interface ViewProps {
    visible: boolean;
    disabled: boolean;
    chain_feature_ids: any;
    open: boolean;
    setOpen: any;
}

export default function ChainFeatureButton(props: ViewProps) {
    const { visible = false, disabled, chain_feature_ids, open, setOpen } = props;

    return (
        <div className={`${visible ? '' : 'hidden'}`}>
            <button
                onClick={() => setOpen(true)}
                className={`rounded-lg text-sm p-2 ${
                    disabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white'
                } flex justify-center  ring-0 shadow-lg mx-1`}
            >
                <SparklesIcon className="h-5 w-5" />
            </button>
            <ChainFeatureList open={open} setOpen={setOpen} chain_feature_ids={chain_feature_ids} />
        </div>
    );
}
