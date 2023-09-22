import { DocumentIcon } from '@heroicons/react/20/solid';

interface ViewProps {
    document: any;
    isRecommend?: boolean;
    handleClickRadio?: any;
}

export default function DocumentRowView(props: ViewProps) {
    const { document, isRecommend, handleClickRadio } = props;

    return (
        <>
            <div className="flex flex-row items-center px-2 py-2 ">
                {isRecommend && (
                    <input
                        type={'radio'}
                        name="document"
                        className="m-2"
                        onClick={() => handleClickRadio(document)}
                    />
                )}
                <DocumentIcon className=" h-6 text-gray-200 mr-1" />
                {isRecommend ? (
                    <a className=" ">{document.name}</a>
                ) : (
                    <a
                        href={document.storage_url}
                        target="_blank"
                        rel="noreferrer"
                        className=" hover:underline"
                    >
                        {document.name}
                    </a>
                )}
            </div>
        </>
    );
}
