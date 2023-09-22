import axios from 'axios';
import getPrompt from './getPrompt';
import sendPrompt from './sendPrompt';

export default async function extractEntityFromAbsentForm(
    content: string,
    token: string
): Promise<string> {
    const template: string = (await getPrompt(33)).data.template;
    const prompt = template.replace(/\{\{info.*?\}\}/g, content);
    const res = await sendPrompt(prompt);
    return res.data.data.raw_response;
}
