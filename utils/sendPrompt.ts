import axios from 'axios';

export default async function sendPrompt(prompt: string) {
    return axios.request({
        url: '/prompts/doc_ai_llm/run.json',
        method: 'POST',
        data: {
            params: {
                prompt
            },
            llm_response: true
        }
    });
}
