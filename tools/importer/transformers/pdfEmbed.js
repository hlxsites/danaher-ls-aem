import { pdfembed } from './util.js';

const createPDFEmbed = (main, document) => {
  const pdfViewer = main.querySelectorAll('div.pdfviewer');
  pdfViewer.forEach((pdf) => {
    pdfembed(pdf, document);
  });
};
export default createPDFEmbed;
