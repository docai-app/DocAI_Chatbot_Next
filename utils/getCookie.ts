'use client';
export default function getCookie(key: string) {
    if (document.cookie.indexOf(key) < 0) {
        return null;
    }
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let temp = cookies[i].split('=');
        if (temp[0].replace(/\s/g, '') == key) {
            return decodeURIComponent(temp[1]);
        }
    }
    return null;
}
