import { getAllChainFeatureDatas } from '@/app/apis/AirtableChainFeature';
import { useEffect, useState } from 'react';
import IframeView from '../export/IframeView';
import ChainFeatureRowView from './ChainFeatureRowView';

interface ViewProps {
    chain_feature_ids?: any[];
    showIframe: boolean;
    setShowIframe: any;
    selectDocument?: any;
    selectContent?: any;
}

export default function ChainFeatureListView(props: ViewProps) {
    const { chain_feature_ids, showIframe, setShowIframe, selectDocument, selectContent } = props;

    const [datas, setDatas] = useState<any>([]);
    const [link, setLink] = useState('');
    const [maxHeight, setMaxHeight] = useState(500);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setMaxHeight(document.body.offsetHeight * 0.8);
        getAllChainFeatureDatas(chain_feature_ids).then((res: any) => {
            // console.log(res);
            setDatas(res);
            setLoading(false);
        });
    }, [chain_feature_ids]);

    const openIframe = (id: string) => {
        setShowIframe(true);
        if (selectDocument) {
            setLink(
                process.env.NEXT_PUBLIC_AIADMIN_SERVER +
                    `chainfeature/${id}?document=${JSON.stringify(selectDocument)}&showChatbot=true`
            );
        } else {
            setLink(process.env.NEXT_PUBLIC_AIADMIN_SERVER + `chainfeature/${id}?showChatbot=true`);
        }
    };

    return (
        <div className="p-2">
            {showIframe ? (
                // <iframe id='calculation' src={link} title="external-page" width="100%" height={maxHeight} />
                <IframeView content={selectContent} type="input" aiadmin_link={link} />
            ) : (
                <div>
                    {datas?.map((data: any, index: number) => {
                        return (
                            <ChainFeatureRowView
                                key={index}
                                id={data.id}
                                data={data.fields}
                                onClick={openIframe}
                            />
                        );
                    })}
                    {loading && (
                        <p className=" flex justify-center my-10 text-gray-500">正在加載數據...</p>
                    )}
                    {!loading && datas?.length == 0 && (
                        <p className=" flex justify-center my-10 text-gray-500">
                            暫無相關Chain Feature
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
