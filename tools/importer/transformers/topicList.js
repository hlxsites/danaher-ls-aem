/* global WebImporter */
const createTopicList = (main, document) => {
  const topicList = main.querySelector('div#topic-list')?.parentNode;
  if (topicList) {
    topicList.innerHTML = '';
    const block = [['topic-list'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    topicList.append(table);
  }
};
export default createTopicList;
