import header from './header.js';
import footer from './footer.js';
import stickyFooter from './stickyFooter.js';
import videoEmbed from './videoEmbed.js';

// eslint-disable-next-line import/prefer-default-export
export const transformers = [
  videoEmbed,
];

export const xfTransformers = [
  footer,
  stickyFooter,
];

export const xfAsyncTransformers = [
  header,
];

export const preTransformers = [

];

export const postTransformers = [

];
