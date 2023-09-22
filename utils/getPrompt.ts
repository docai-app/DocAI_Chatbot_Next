import axios from 'axios';

export default async function getPrompt(
    id: number
    // token: string
): Promise<any> {
    const res = await axios.request({
        baseURL: process.env.NEXT_PUBLIC_PORMHUB_SERVER,
        url: `/api/document_prompts/${id}`
        // params: { token },
    });
    return res.data;
}
