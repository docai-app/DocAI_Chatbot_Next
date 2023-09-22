import { AxiosRequestConfig } from 'axios';
const baseURL = process.env.NEXT_PUBLIC_DOCAI_SERVER;

export default class Storage {
    upload_generated_content() {
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            url: `/api/v1/storage/upload/generated_content`,
            method: 'POST'
        };
        return requestHeader;
    }
    upload_chatbot() {
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            url: `/api/v1/storage/upload/chatbot`,
            method: 'POST'
        };
        return requestHeader;
    }
}
