import Api from '@/app/apis';
import useAlert from '@/hooks/useAlert';
import useAxios from 'axios-hooks';
import { useFormik } from 'formik';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import SearchDocumentForm from './SearchDocumentForm';

interface ViewProps {
    open: boolean;
    setOpen: any;
    chatbotData: any;
    getAllLabelsData: any;
    handleStartSearch?: any;
    handleSearchResult?: any;
}

const apiSetting = new Api();

export default function SearchView(props: ViewProps) {
    const { open, setOpen, chatbotData, getAllLabelsData, handleStartSearch, handleSearchResult } =
        props;
    const sheetRef = useRef<BottomSheetRef>(null);
    const [datas, setDatas] = useState<any>([]);
    const [maxHeight, setMaxHeight] = useState(500);
    const { setAlert } = useAlert();
    const [values, setValues] = useState<any>({});

    // const [{ data: getAllLabelsData, error: getAllLabelsError }, getAllLabels] = useAxios(
    //     apiSetting.Tag.getAllTags(),
    //     { manual: true }
    // );

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
        setMaxHeight(document.body.offsetHeight * 0.8);
        // getAllLabels()
        // console.log(_.map(chatbotData?.folders, function (folder) { return folder.id }));
    }, []);

    useEffect(() => {
        if (searchDocumentByContentData) {
            handleSearchResult(_.merge(searchDocumentByContentData, values));
        }
    }, [searchDocumentByContentData]);

    const renderHeader = () => {
        return (
            <div className="w-full  relative items-center">
                <label>Search</label>
                <label className=" absolute right-0" onClick={back}>
                    {'关闭'}
                </label>
            </div>
        );
    };
    const back = () => {
        setOpen(false);
    };

    const searchDocumentFormik = useFormik({
        initialValues: {
            tag_id: '',
            content: '',
            date: '',
            from: '',
            to: '',
            folder_ids: [],
            page: 1
        },
        onSubmit: async (values) => {
            searchDocumentByContent({
                params: {
                    ...values
                }
            });
        }
    });

    const handleSearch = (tag: any, content: string, startDate: string, endDate: string) => {
        setOpen(false);
        if (!tag) {
            setAlert({
                title: '請選擇類別',
                type: 'info'
            });
            return;
        }
        if (startDate > endDate) {
            setAlert({ title: '起始日期不能大於結束日期', type: 'info' });
            return;
        }
        const folder_ids: any = _.map(chatbotData?.folders, function (folder) {
            return folder.id;
        });
        // console.log(folder_ids);

        const values = {
            content: content + '',
            date: '',
            tag_id: tag?.id,
            tag_name: tag?.name,
            from: startDate,
            to: endDate,
            folder_ids: folder_ids,
            chain_feature_ids: tag?.meta?.chain_features || [],
            page: 1
        };
        setValues({ values: values });
        searchDocumentFormik.setValues(values);
        searchDocumentFormik.handleSubmit();
        handleStartSearch(values);
    };

    return (
        <>
            <BottomSheet
                open={open}
                ref={sheetRef}
                onDismiss={() => {
                    setOpen(false);
                }}
                maxHeight={maxHeight}
                header={renderHeader()}
            >
                <div className="p-2">
                    <SearchDocumentForm getAllLabelsData={getAllLabelsData} search={handleSearch} />
                </div>
            </BottomSheet>
        </>
    );
}
