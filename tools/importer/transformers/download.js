/* global WebImporter */
if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser
const createDownload = (main, document) => {
  const downloadAll = main.querySelectorAll('div.download');
  const downloads = [];
  let downloadParentEl;
  [...downloadAll].forEach((element, index) => {
    if (index === 0) downloadParentEl = element.parentElement;
    const download = element.querySelector('download');
    if (download) {
      const leftDiv = document.createElement('div');
      const rightDiv = document.createElement('div');

      const title = download?.getAttribute('title');
      const heading = download?.getAttribute('heading');
      const linkUrl = download?.getAttribute('url');
      const buttonText = download?.getAttribute('btn-text');
      // eslint-disable-next-line no-undef
      const assetTags = JSON.parse(decodeHtmlEntities(download?.getAttribute('asset-tags-json')));

      const image = download?.getAttribute('image-url') ? document.createElement('img') : null;
      if (image) {
        image.src = download?.getAttribute('image-url');
        image.alt = download?.getAttribute('image-alt') ? download?.getAttribute('image-alt') : 'Danaher Corporation';
        leftDiv.append(image);
      }
      if (heading) {
        const p = document.createElement('p');
        p.textContent = heading;
        rightDiv.append(p);
      }
      if (title) {
        const h2 = document.createElement('h2');
        h2.textContent = title;
        rightDiv.append(h2);
      }
      const tagsDiv = document.createElement('div');
      const strongEl = document.createElement('strong');
      const assetTagsList = assetTags.map((list) => ` ${list.name}`);
      strongEl.innerHTML = assetTagsList;
      tagsDiv.append(strongEl);
      rightDiv.append(tagsDiv);
      if (buttonText) {
        const anc = document.createElement('a');
        anc.setAttribute('href', linkUrl);
        anc.textContent = buttonText;
        anc.class = download?.getAttribute('btn-color');
        rightDiv.append(anc);
      }
      downloads.push([leftDiv, rightDiv]);
    }
  });
  const cells = [['Download'], ...downloads];
  if (downloads.length > 0) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    WebImporter.DOMUtils.remove(downloadParentEl, [
      'div.imagetext',
    ]);
    downloadParentEl.append(block);
  }
};

export default createDownload;
