import axios from 'axios';
import getPrompt from './getPrompt';

export default async function convertTextToPDF(text: string): Promise<Blob> {
    const html2pdf = await require('html2pdf.js');
    let template = (await getPrompt(32)).data.template;
    let prompt = template.replace(/\{\{info.*?\}\}/g, text);
    const res = await axios.request({
        baseURL: process.env.NEXT_PUBLIC_PORMHUB_SERVER,
        url: '/prompts/doc_ai_llm/run.json', // to be confirmed
        method: 'POST',
        data: {
            params: {
                prompt
            },
            llm_response: true
        }
    });
    const html: string = res.data.data.raw_response;
    console.log(html);
    // return pdf(
    //   <Document>
    //     <Page>{html}</Page>
    //   </Document>
    // ).toBlob();
    // return fetch("/api", {
    //   method: "POST",
    //   body: JSON.stringify({ text: md }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }).then((res) => res.blob());
    return html2pdf().set({ margin: 10 }).from(html).outputPdf('blob');
    // return html2pdf().set({ margin: 10 }).from(html).save();
    // const data = new FormData();
    // data.append("content", text);
    // const res = await axios.request({
    //   baseURL: process.env.NEXT_PUBLIC_DOCAI_SERVER,
    //   url: "/api/v1/tools/text_to_pdf",
    //   data,
    //   method: "POST",
    // });
    // const pdfURL = `data:application/pdf;base64,${res.data.pdf}`;
    // return fetch(pdfURL).then((res) => res.blob());
}
