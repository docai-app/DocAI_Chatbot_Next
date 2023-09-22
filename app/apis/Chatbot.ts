import { AxiosRequestConfig } from 'axios';
const baseURL = process.env.NEXT_PUBLIC_DOCAI_SERVER;

export default class Chatbot {
    allChatbots() {
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            url: `/api/v1/chatbots`,
            method: 'GET'
        };
        return requestHeader;
    }
    chatbots(id: string) {
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            url: `/api/v1/chatbots/${id}`,
            method: 'GET'
        };
        return requestHeader;
    }
    assistant_message() {
        const requestHeader: AxiosRequestConfig = {
            baseURL: baseURL,
            url: `/api/v1/chatbots/assistant/message`,
            method: 'POST'
        };
        return requestHeader;
    }
}
