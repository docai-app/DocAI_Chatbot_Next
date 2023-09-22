import { useCallback, useState } from 'react';

export default function MessageBox({ content, children }: { content?: string; children?: any }) {
    const [showMore, setShowMore] = useState(false);

    const share = useCallback((type: 'pdf' | 'text', data: string | Blob) => {
        if (!data) return;
        console.log(type, data);
        let shareData: ShareData = {};
        if (type === 'text') {
            shareData = { text: data as string };
        } else {
            shareData = { files: [new File([data as Blob], 'Untitled.pdf')] };
        }
        try {
            window.navigator.share(shareData).catch((error) => console.error(error));
        } catch {
            alert('Sorry, this browser does not support sharing.');
        }
    }, []);

    return (
        <div className="flex flex-col gap-1 break-words">
            {content &&
                (showMore ? (
                    <>
                        {content.split('\n').map((item: string, index: number) => (
                            <p key={index}>{item}</p>
                        ))}
                        <a
                            className="text-gray-500 font-bold hover:underline cursor-pointer"
                            onClick={() => setShowMore(false)}
                        >
                            Show Less
                        </a>
                    </>
                ) : (
                    <>
                        {(content.length > 600 ? content.slice(0, 600) + '...' : content)
                            .split('\n')
                            .map((item: string, index: number) => (
                                <p key={index}>{item}</p>
                            ))}
                        {content.length > 600 && (
                            <a
                                className="text-gray-500 font-bold hover:underline cursor-pointer"
                                onClick={() => setShowMore(true)}
                            >
                                Show More
                            </a>
                        )}
                    </>
                ))}
            {children}
        </div>
    );
}
