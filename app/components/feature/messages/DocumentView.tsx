import { DocumentTextIcon } from '@heroicons/react/20/solid';

interface ViewProps {
    document: any;
}

export default function DocumentView(props: ViewProps) {
    const { document } = props;

    return (
        <>
            <a
                className="flex gap-3 items-center"
                href={document.storage_url}
                target="_blank"
                rel="noopener"
            >
                <DocumentTextIcon className="h-6 w-6" />
                <div className="text-white">{document.name}</div>
            </a>
        </>
    );
}
