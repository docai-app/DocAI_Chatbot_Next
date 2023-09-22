import { DocumentTextIcon } from '@heroicons/react/20/solid';

interface ViewProps {
    fileURL: string;
    fileName: string;
}

export default function FileView(props: ViewProps) {
    const { fileURL, fileName } = props;

    return (
        <>
            <a className="flex gap-3 items-center" href={fileURL} target="_blank" rel="noopener">
                <DocumentTextIcon className="h-6 w-6" />
                <div className="text-gray-500">{fileName}</div>
            </a>
        </>
    );
}
