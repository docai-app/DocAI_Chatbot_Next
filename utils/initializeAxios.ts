'use client';
import axios from 'axios';

export default function initializeAxios(token: string) {
    // const token = window.localStorage?.getItem('chatbot_authorization') //getCookie("authorization");
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_DOCAI_SERVER;
    // console.log('window.localStorage?.', window.localStorage?.getItem('authorization'));
    // console.log('token', token);
    axios.defaults.headers.authorization =
        window.localStorage?.getItem('authorization') || `${token}`;
    // console.log('token:', token);
    // console.log('cookie ', getCookie("authorization"));
}
