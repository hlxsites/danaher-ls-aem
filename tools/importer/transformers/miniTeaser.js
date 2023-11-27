/* global WebImporter */
const teaser = (xf, cards, document) => {
  xf.querySelectorAll('grid[columns="3"] > template').forEach((tmp) => {
    const articleCard = tmp.content.querySelector('articlecard');
    if (articleCard) {
      const cardImg = articleCard.getAttribute('cardimg');
      const cardTitle = articleCard.getAttribute('cardtitle');
      const cardHref = articleCard.getAttribute('cardhref');
      const cardLinkText = articleCard.getAttribute('linktext');

      const divEl = document.createElement('div');
      const img = document.createElement('img');
      img.setAttribute('src', cardImg);
      divEl.append(img);
      const h3 = document.createElement('h3');
      h3.textContent = cardTitle;
      divEl.append(h3);
      const a = document.createElement('a');
      a.setAttribute('href', cardHref);
      a.textContent = cardLinkText;
      divEl.append(a);
      cards.push(divEl);
    }
    const featureimage = tmp.content.querySelector('feature-image');
    if (featureimage) {
      const cardImg = featureimage.getAttribute('img');
      const cardTitle = featureimage.getAttribute('title');
      const btnRfq = featureimage.getAttribute('btnrfq');
      const btnHref = featureimage.getAttribute('btnhref');
      const cardLinkText = featureimage.getAttribute('btntext');

      const divEl = document.createElement('div');
      const img = document.createElement('img');
      img.setAttribute('src', cardImg);
      divEl.append(img);
      const h3 = document.createElement('h3');
      h3.textContent = cardTitle;
      divEl.append(h3);
      const a = document.createElement('a');
      if (btnRfq) a.setAttribute('href', '#RequestAQuote');
      else a.setAttribute('href', btnHref);
      a.textContent = cardLinkText;
      divEl.append(a);
      cards.push(divEl);
    }
  });
};

const createMiniTeaser = (main, document) => {
  const websiteLinks = main.querySelector('div#website-links');
  if (websiteLinks) {
    const xf = websiteLinks.closest('div.experiencefragment');
    const cards = [];
    teaser(xf, cards, document);
    const cells = [['Mini Teasers'],
      cards,
    ];
    if (cells.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      xf.append(block);
    }
  }
};
export default createMiniTeaser;
