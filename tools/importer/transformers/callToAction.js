import {
  c2a,
} from './util.js';

const createCTA = (main, document) => {
  const ctaSection = main.querySelectorAll('div.cta-section');
  [...ctaSection].forEach((cta) => {
    c2a(cta, document);
  });
};
export default createCTA;