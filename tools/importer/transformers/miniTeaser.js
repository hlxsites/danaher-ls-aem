/* global WebImporter */
const teaser = (links, cards, document) => {
  links.querySelectorAll('div.grid > grid > template').forEach((tmp) => {
    const articleCard = tmp.content.querySelector('articlecard');
    if (articleCard) {
      const cardImg = articleCard.getAttribute('cardimg');
      const altText = articleCard.getAttribute('imagealttext') ? articleCard.getAttribute('imagealttext') : 'Danaher Corporation';
      const cardTitle = articleCard.getAttribute('cardtitle');
      const cardHref = articleCard.getAttribute('cardhref');
      const cardLinkText = articleCard.getAttribute('linktext');
      const cardDescription = articleCard.getAttribute('carddescription');

      const leftDiv = document.createElement('div');
      const img = document.createElement('img');
      img.setAttribute('src', cardImg);
      img.setAttribute('alt', altText);
      leftDiv.append(img);

      const rightDiv = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = cardTitle;
      rightDiv.append(h3);
      if(cardDescription){
        const desc = document.createElement('p');
        desc.textContent = cardDescription;
        rightDiv.append(desc);
      }
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
      const cardDescription = featureimage.getAttribute('description');

      const leftDiv = document.createElement('div');
      const img = document.createElement('img');
      img.setAttribute('src', cardImg);
      img.setAttribute('alt', cardImgAlt);
      leftDiv.append(img);

      const rightDiv = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = cardTitle;
      rightDiv.append(h3);
      if(cardDescription){
        const desc = document.createElement('p');
        desc.innerHTML = cardDescription;
        rightDiv.append(desc);
      }
      const a = document.createElement('a');
      if (btnRfq) a.setAttribute('href', '#RequestAQuote');
      else a.setAttribute('href', btnHref);
      a.textContent = cardLinkText;
      rightDiv.append(a);
      cards.push([leftDiv, rightDiv]);
      tmp.remove();
    }
  });
};

const createMiniTeaser = (main, document) => {
  const websiteLinks = main.querySelectorAll('div#mini-teaser');
  if (websiteLinks.length > 0) {
    websiteLinks.forEach((links) => {
      const cards = [];
      teaser(links, cards, document);
      const cells = [['Mini Teasers'],
        ...cards,
      ];
      if (cards.length > 0) {
        const block = WebImporter.DOMUtils.createTable(cells, document);
        links.append(block);
      }
    });
  }
};
export default createMiniTeaser;
