import header from './header.js';
import footer from './footer.js';
import stickyFooter from './stickyFooter.js';
import videoEmbed from './videoEmbed.js';
import cta from './callToAction.js';
import accordion from './accordion.js';
import banner from './banner.js';
import carousel from './carousel.js';
import logoCloud from './logoCloud.js';
import heroVideo from './heroVideo.js';
import breadcrumb from './breadcrumb.js';
import cards from './cards.js';
import eventCards from './eventCards.js';
import columns from './columns.js';
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
import takeaway from './takeaway.js';
import topicList from './topicList.js';
import table from './table.js';
import libraryHub from './libraryHub.js';
import sideNav from './sideNav.js';
import miniTeaser from './miniTeaser.js';
import productCategoryList from './productCategoryList.js';
import opcoHomeArticlesList from './opcoHomeArticlesList.js';
import socialFeeds from './socialFeeds.js';
import postProcessSVGIcons from './postProcessSVGIcons.js';
import productMenu from './productMenu.js';
import pageJumpMenu from './pageJumpMenu.js';
import download from './download.js';
import workflowTabs from './workflowTabs.js';
import timeline from './timeline.js';
import stats from './stats.js';
import workflowCarousel from './workflowCarousel.js';
import embedScript from './embedScript.js';

// eslint-disable-next-line import/prefer-default-export
export const transformers = [
  table,
  videoEmbed,
  cta,
  accordion,
  banner,
  carousel,
  logoCloud,
  heroVideo,
  breadcrumb,
  cards,
  eventCards,
  heading,
  image,
  workflowContainer,
  featureImage,
  product,
  articles,
  cardList,
  pdfEmbed,
  takeaway,
  fullLayout,
  weSee,
  testmonial,
  bannerAEM,
  productCategory,
  coveoCategory,
  topicList,
  libraryHub,
  sideNav,
  miniTeaser,
  columns,
  productCategoryList,
  opcoHomeArticlesList,
  socialFeeds,
  productMenu,
  pageJumpMenu,
  download,
  workflowTabs,
  timeline,
  stats,
  workflowCarousel,
  embedScript,
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
  postProcessSVGIcons,
  metadata,
];
