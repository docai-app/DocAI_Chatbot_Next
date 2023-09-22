'use client';
import { Dispatch, SetStateAction, createContext, useState } from 'react';

interface AlertModalProps {
    title: string;
    show?: boolean;
    content?: any;
    type?: 'success' | 'warning' | 'error' | 'info';
    confirmText?: string;
    cancelText?: string;
    setConfirmation?: (value: boolean) => void;
}

interface AlertContextProps extends AlertModalProps {
    setAlert: (props: AlertModalProps) => void;
}

const initialState = {
    title: '',
    show: false
};

const AlertContext = createContext<AlertContextProps>({
    ...initialState,
    setAlert: (props: AlertModalProps) => {}
});

export const AlertProvider = ({ children }: any) => {
    const [props, setProps] = useState<AlertModalProps>({
        title: '',
        show: false
    });

    const setAlert = (props: AlertModalProps) => {
        setProps({ show: true, ...props });
    };

    return (
        <AlertContext.Provider
            value={{
                ...props,
                setAlert
            }}
        >
            {children}
        </AlertContext.Provider>
    );
};

export default AlertContext;
