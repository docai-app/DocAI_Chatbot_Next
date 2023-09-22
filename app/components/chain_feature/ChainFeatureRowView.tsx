interface ViewProps {
    id: string;
    data?: any;
    onClick: any;
}
export default function ChainFeatureRowView(props: ViewProps) {
    const { id, data, onClick } = props;
    return (
        <>
            <div className="flex flex-row rounded-sm border p-2 my-2">
                <a className="flex flex-1 flex-col cursor-pointer" onClick={() => onClick(id)}>
                    <p className=" text-black">{data?.name}</p>
                    <p className="text-sm text-gray-400 min-h-[20px]">
                        {data?.description || '暫無描述'}
                    </p>
                </a>
            </div>
        </>
    );
}
