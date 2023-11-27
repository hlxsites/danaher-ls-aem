/* global WebImporter */
const teaser = (xf, cards, document) => {
  xf.querySelectorAll('grid[columns="3"] > template').forEach((tmp) => {
    const articleCard = tmp.content.querySelector('articlecard');
    if (articleCard) {
      const cardImg = articleCard.getAttribute('cardimg');
      const altText = articleCard.getAttribute('imagealttext') ? articleCard.getAttribute('imagealttext') : 'Danaher Corporation';
      const cardTitle = articleCard.getAttribute('cardtitle');
      const cardHref = articleCard.getAttribute('cardhref');
      const cardLinkText = articleCard.getAttribute('linktext');

      const leftDiv = document.createElement('div');
      const img = document.createElement('img');
      img.setAttribute('src', cardImg);
      img.setAttribute('alt', altText);
      leftDiv.append(img);

      const rightDiv = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = cardTitle;
      rightDiv.append(h3);
      const a = document.createElement('a');
      a.setAttribute('href', cardHref);
      a.textContent = cardLinkText;
      rightDiv.append(a);
      cards.push([leftDiv, rightDiv]);
    }
    const featureimage = tmp.content.querySelector('feature-image');
    if (featureimage) {
      const cardImg = featureimage.getAttribute('img');
      const cardImgAlt = featureimage?.getAttribute('imgalt') ? featureimage?.getAttribute('imgalt') : 'Danaher Corporation';
      const cardTitle = featureimage.getAttribute('title');
      const btnRfq = featureimage.getAttribute('btnrfq');
      const btnHref = featureimage.getAttribute('btnhref');
      const cardLinkText = featureimage.getAttribute('btntext');

      const leftDiv = document.createElement('div');
      const img = document.createElement('img');
      img.setAttribute('src', cardImg);
      img.setAttribute('alt', cardImgAlt);
      leftDiv.append(img);

      const rightDiv = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = cardTitle;
      rightDiv.append(h3);
      const a = document.createElement('a');
      if (btnRfq) a.setAttribute('href', '#RequestAQuote');
      else a.setAttribute('href', btnHref);
      a.textContent = cardLinkText;
      rightDiv.append(a);
      cards.push([leftDiv, rightDiv]);
    }
  });
};

const createMiniTeaser = (main, document) => {
  const websiteLinks = main.querySelector('div#mini-teaser');
  if (websiteLinks) {
    const xf = websiteLinks.closest('div.experiencefragment');
    const cards = [];
    teaser(xf, cards, document);
    const cells = [['Mini Teasers'],
      ...cards,
    ];
    if (cards.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      xf.innerHTML = '';
      xf.append(block);
    }
  }
};
export default createMiniTeaser;
