import Api from '@/app/apis';
import useAxios from 'axios-hooks';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import DocumentRowView from './DocumentRow';

interface ViewProps {
    search_result: any;
    isRecommend?: boolean;
    setSelectDocument?: any;
}

const apiSetting = new Api();

export default function DocumentListView(props: ViewProps) {
    const { search_result, isRecommend, setSelectDocument } = props;

    const sheetRef = useRef<BottomSheetRef>(null);
    const [allItemsData, setAllItemsData] = useState<any>([]);
    const [values, setValues] = useState<any>({});
    const [meta, setMeta] = useState<any>({});
    const [
        {
            data: searchDocumentByContentData,
            loading: searchDocumentByContentLoading,
            error: searchDocumentByContentError,
            response: searchDocumentByContentResponse
        },
        searchDocumentByContent
    ] = useAxios(apiSetting.Search.searchDocumentByTagContent(), { manual: true });

    useEffect(() => {
        if (search_result) {
            setValues(search_result?.values);
            setMeta(search_result?.meta);
            setAllItemsData(search_result?.documents);
        }
    }, [search_result]);

    useEffect(() => {
        if (values?.page && values?.page > 1) {
            searchDocumentByContent({
                params: {
                    ...values
                }
            });
        }
    }, [values]);

    useEffect(() => {
        if (searchDocumentByContentData && searchDocumentByContentData.success) {
            setMeta(searchDocumentByContentData.meta);
            setAllItemsData(allItemsData.concat(searchDocumentByContentData?.documents));
        }
    }, [searchDocumentByContentData]);

    const showAllItemsHandler = () => {
        setValues({
            ...values,
            page: values.page + 1
        });
    };

    const handleClickRadio = (document: any) => {
        setSelectDocument(document);
    };

    return (
        <>
            <div className="p-2">
                <p className="flex justify-center">相關文檔有{meta?.total_count}份</p>
                <InfiniteScroll
                    dataLength={allItemsData?.length || 0} //This is important field to render the next data
                    next={showAllItemsHandler}
                    hasMore={meta?.next_page != null}
                    height={'auto'}
                    style={{ maxHeight: '80vh' }}
                    loader={
                        <p className="p-4 text-center">
                            <b>載入中...</b>
                        </p>
                    }
                    endMessage={<p className="p-4 text-gray-300 text-center">沒有更多資料</p>}
                >
                    {allItemsData?.map((doc: any, index: number) => {
                        return (
                            <DocumentRowView
                                key={index}
                                document={doc}
                                isRecommend={isRecommend}
                                handleClickRadio={handleClickRadio}
                            />
                        );
                    })}
                </InfiniteScroll>
            </div>
        </>
    );
}
