import { useState } from 'react';
import Dropdowns from '../../common/Dropdowns';
import DocumentList from '../../document/DocumentList';
import RecommendButton from '../button/RecommendButton';

interface ViewProps {
    search_result: any;
    set_search_result?: any;
}

export default function SearchResultView(props: ViewProps) {
    const { search_result, set_search_result } = props;

    const [openDocumentList, setOpenDocumentList] = useState(false);
    const [isRecommend, setIsRecommend] = useState(false);

    return (
        <>
            <div className="flex flex-row items-center">
                <div className="bg-blue-500 rounded-xl rounded-tl-none p-2  shadow">
                    <p>相關文檔有{search_result?.meta?.total_count || '0'}份</p>
                    {search_result?.meta?.total_count > 1 && (
                        <a
                            className="my-2 cursor-pointer text-white underline"
                            onClick={() => {
                                // set_search_result(search_result)
                                setOpenDocumentList(true);
                                setIsRecommend(false);
                            }}
                        >
                            {'點擊查看>>'}
                        </a>
                    )}
                </div>
                <div className="ml-2 hidden ">
                    {search_result?.meta?.total_count > 0 && (
                        <Dropdowns
                            show_chain_feature={true}
                            chain_feature={() => {
                                setOpenDocumentList(true);
                                setIsRecommend(true);
                            }}
                        />
                    )}
                </div>
            </div>
            <RecommendButton
                // visible={search_result?.meta?.total_count > 0}
                visible={false}
                style={'mt-2'}
                onClick={() => {
                    setOpenDocumentList(true);
                    setIsRecommend(true);
                }}
            />

            <DocumentList
                open={openDocumentList}
                setOpen={setOpenDocumentList}
                search_result={search_result}
                isRecommend={isRecommend}
            />
        </>
    );
}
