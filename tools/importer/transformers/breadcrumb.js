/* global WebImporter */
const createBreadcrumb = (main, document) => {
  const breadcrumb = main.querySelector('div.breadcrumb');
  if (breadcrumb) {
    const breadcrumbEl = breadcrumb.querySelector('breadcrumb');
    if (breadcrumbEl) {
      const cells = [];
      // eslint-disable-next-line no-undef
      const list = JSON.parse(decodeHtmlEntities(breadcrumbEl.getAttribute('breadcrumbdetailslist')));
      cells.push(['Breadcrumb']);
      const ul = document.createElement('ul');
      list.forEach((item) => {
        if (!item.url?.includes('/content/experience-fragments')) {
          const li = document.createElement('li');
          const anc = document.createElement('a');
          anc.href = item.url;
          anc.textContent = item.title;
          li.append(anc);
          ul.append(li);
        }
      });
      cells.push([ul]);
      if (ul.firstElementChild) {
        const block = WebImporter.DOMUtils.createTable(cells, document);
        const firstChild = main.firstElementChild?.firstChild;
        main.firstElementChild.insertBefore(block, firstChild);
        firstChild?.after(document.createElement('hr'));
      }
    }
  }
};
export default createBreadcrumb;
