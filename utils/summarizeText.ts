import getPrompt from './getPrompt';
import sendPrompt from './sendPrompt';

export default async function summarizeText(text: string): Promise<string> {
    const template = (await getPrompt(24)).data.template;
    const prompt = template.replace(/\{\{info.*?\}\}/g, text);
    const res = await sendPrompt(prompt);
    if (!res.data.success) return '';
    return res.data.data.raw_response;
}
