import { useState } from 'react';

interface ViewProps {
    content: string;
}

export default function ContentView(props: ViewProps) {
    const { content } = props;
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-1 break-words">
                {content &&
                    (showMore ? (
                        <>
                            {content.split('\n').map((item: string, index: number) => (
                                <p key={index}>{item}</p>
                            ))}
                            <a
                                className="text-black font-bold hover:underline cursor-pointer"
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
                                    className="text-black font-bold hover:underline cursor-pointer"
                                    onClick={() => setShowMore(true)}
                                >
                                    Show More
                                </a>
                            )}
                        </>
                    ))}
            </div>
        </>
    );
}
