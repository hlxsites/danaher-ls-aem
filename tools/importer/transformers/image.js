import {
  imagetext,
} from './util.js';

const createImage = (main, document) => {
  const imageText = main.querySelectorAll('div.imagetext');
  [...imageText].forEach((imgText) => {
    imagetext(imgText, document);
  });
};
export default createImage;
