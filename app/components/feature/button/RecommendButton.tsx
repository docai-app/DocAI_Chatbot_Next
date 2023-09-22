import { SparklesIcon } from '@heroicons/react/24/outline';

interface ViewProps {
    visible: boolean;
    onClick: any;
    style?: any;
}

export default function RecommendButton(props: ViewProps) {
    const { visible = false, onClick, style } = props;
    return (
        <>
            <div
                className={`${style} p-2 rounded-full border flex flex-row bg-white items-center justify-center  cursor-pointer ${
                    visible ? '' : 'hidden'
                }`}
                onClick={onClick}
            >
                <SparklesIcon className="h-5 w-5" />
                <span className=" text-sm">推荐功能</span>
            </div>
        </>
    );
}
