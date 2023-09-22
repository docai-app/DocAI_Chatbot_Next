import axios from 'axios';

// https://stackoverflow.com/a/40662025/15442622
export default async function extractTextFromPDF(file: File) {
    // const pdfJS = await import("pdfjs-dist");
    // pdfJS.GlobalWorkerOptions.workerSrc =
    //   window.location.origin + "/pdf.worker.min.js";
    // let pdf = pdfJS.getDocument(pdfUrl).promise;
    // const pdf_1 = await pdf;
    // // get all pages text
    // let maxPages = pdf_1.numPages;
    // let countPromises = []; // collecting all page promises
    // for (let j = 1; j <= maxPages; j++) {
    //   let page = pdf_1.getPage(j);

    //   countPromises.push(
    //     page.then(async function (page_1) {
    //       // add page promise
    //       let textContent = page_1.getTextContent();
    //       const text = await textContent;
    //       return text.items
    //         .map(function (s: any) {
    //           return s.str;
    //         })
    //         .join(" ");
    //     })
    //   );
    // }
    // const texts = await Promise.all(countPromises);
    const data = new FormData();
    data.append('file', file);
    const res = await axios.request({
        url: '/api/v1/tools/upload_directly_ocr',
        baseURL: process.env.NEXT_PUBLIC_DOCAI_SERVER,
        method: 'POST',
        data
    });
    return res.data.content;
}
