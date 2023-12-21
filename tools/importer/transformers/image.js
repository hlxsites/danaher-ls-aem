import {
  imageText,
} from './util.js';

const createImage = (main, document) => {
  const imageTextEL = main.querySelectorAll('div.imagetext');
  [...imageTextEL].forEach((imgText) => {
    imageText(imgText, document);
  });
};
export default createImage;
