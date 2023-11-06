import { videoembed } from './util.js';

const createVideoEmbed = (main, document) => {
  const videos = main.querySelectorAll('div.video');
  videos.forEach((video) => {
    videoembed(video, document);
  });
};
export default createVideoEmbed;
