import header from './header.js';
import footer from './footer.js';
import stickyFooter from './stickyFooter.js';
import videoEmbed from './videoEmbed.js';
import cta from './callToAction.js';
import accordion from './accordion.js';
import banner from './banner.js';
import logoCloud from './logoCloud.js';
import heroVideo from './heroVideo.js';
import breadcrumb from './breadcrumb.js';
import cards from './cards.js';
import eventCards from './eventCards.js';

// eslint-disable-next-line import/prefer-default-export
export const transformers = [
  videoEmbed,
  cta,
  accordion,
  banner,
  logoCloud,
  heroVideo,
  breadcrumb,
  cards,
  eventCards,
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
