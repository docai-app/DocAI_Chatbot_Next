import useAlert from '@/hooks/useAlert';
import { useState } from 'react';
import ModalImage from 'react-modal-image';

interface ViewProps {
    content: any;
}

export default function ImageView(props: ViewProps) {
    const { content } = props;
    const { setAlert } = useAlert();
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* <img src={content} className="w-full cursor-pointer" onClick={handleClickImage} alt="" /> */}

            <ModalImage small={content} large={content} alt="img" />
        </>
    );
}
