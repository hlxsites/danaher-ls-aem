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
import twoColumns from './twoColumns.js';
import heading from './heading.js';
import image from './image.js';
import featureImage from './featureImage.js';
import product from './product.js';
import articles from './sideBarArticles.js';
import cardList from './cardList.js';
import pdfEmbed from './pdfEmbed.js';
import fullLayout from './fullLayoutSection.js';
import weSee from './weSee.js';
import metadata from './metadata.js';
import testmonial from './testmonial.js';
import bannerAEM from './bannerAEM.js';
import productCategory from './productCategory.js';
import coveoCategory from './coveoCategory.js';
import workflowContainer from './workflowContainer.js';

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
  twoColumns,
  heading,
  image,
  workflowContainer,
  featureImage,
  product,
  articles,
  cardList,
  pdfEmbed,
  fullLayout,
  weSee,
  testmonial,
  bannerAEM,
  productCategory,
  coveoCategory,
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
  metadata,
];
