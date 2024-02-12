/* global WebImporter */
const URLS_TO_BLOCK_MAP = [
  {
    url: '/blog.html',
    blockName: 'Card List (blog)',
  },
  {
    url: '/blog/topics-template.html',
    blockName: 'Card List (blog, url-filtered)',
  },
  {
    url: '/news.html',
    blockName: 'Card List (news)',
  },
  {
    url: '/news/topics-template.html',
    blockName: 'Card List (news, url-filtered)',
  },
  {
    url: '/application.html',
    blockName: 'Card List (application)',
  },
];

const createCardList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  if (url) {
    const blockName = URLS_TO_BLOCK_MAP.find((item) => url.endsWith(item.url))?.blockName;
    if (blockName) {
      const block = [[blockName], ['']];
      const table = WebImporter.DOMUtils.createTable(block, document);
      main.append(table);
    }
  }
};
export default createCardList;
