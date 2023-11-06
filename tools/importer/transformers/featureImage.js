import {
  featureimage,
} from './util.js';

const createFeatureImage = (main, document) => {
  const featureImage = main.querySelectorAll('div.featureimage');
  [...featureImage].forEach((featureImg) => {
    featureimage(featureImg, document);
  });
};
export default createFeatureImage;
