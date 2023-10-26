/* global WebImporter */
const createStickyFooter = (main, document) => {
  const stickyFooter = main.querySelector('sticky-footer');
  if (stickyFooter) {
    const div = document.createElement('div');
    // eslint-disable-next-line no-undef
    const stickyFooterList = JSON.parse(decodeHtmlEntities(stickyFooter.getAttribute('stickyfooterslist')));
    const stickyTopList = stickyFooter.getAttribute('top-text');
    div.textContent = stickyTopList;
    const anchors = stickyFooterList.map((list) => {
      const anchor = document.createElement('a');
      anchor.textContent = list.linkName;
      anchor.setAttribute('href', list.linkUrl);
      return [anchor];
    });
    const cells = [
      ['Sticky Footer'],
      ...anchors,
      [div],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    main.append(block);
  }
};
export default createStickyFooter;
