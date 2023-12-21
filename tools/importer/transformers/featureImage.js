import {
  featureImage,
} from './util.js';

const createFeatureImage = (main, document) => {
  const featureImageEL = main.querySelectorAll('div.featureimage');
  [...featureImageEL].forEach((featureImg) => {
    featureImage(featureImg, document);
  });
};
export default createFeatureImage;
