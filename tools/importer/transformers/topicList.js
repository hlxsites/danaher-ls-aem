/* global WebImporter */
const topicList = (main, document) => {
  const topicListEl = main.querySelector('#topic-list');
  if (topicListEl) {
    const block = [['Topic List'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    topicListEl.replaceWith(table);
  }
};
export default topicList;
