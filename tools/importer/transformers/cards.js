/* global WebImporter */
const card = (tmp, cards, document) => {
  const h2 = tmp.content.querySelector('h2');
  const articleCard = tmp.content.querySelector('articlecard');
  if (articleCard) {
    const cardImg = articleCard.getAttribute('cardimg');
    const altText = articleCard.getAttribute('imagealttext');
    const cardTitle = articleCard.getAttribute('cardtitle');
    const cardType = articleCard.getAttribute('cardtype') || null;
    const cardDescription = articleCard.getAttribute('carddescription');
    const cardHref = articleCard.getAttribute('cardhref');
    const cardLinkText = articleCard.getAttribute('linktext');

    const leftDiv = document.createElement('div');
    if (h2) {
      leftDiv.append(h2);
    }
    const img = document.createElement('img');
    img.setAttribute('src', cardImg);
    if (altText) {
      img.setAttribute('alt', altText);
    } else {
      img.setAttribute('alt', 'Danaher Corporation');
    }
    leftDiv.append(img);
    const rightDiv = document.createElement('div');
    if (cardType) {
      const typeEl = document.createElement('p');
      typeEl.textContent = cardType;
      rightDiv.append(typeEl);
    }
    const h3 = document.createElement('h3');
    h3.textContent = cardTitle;
    rightDiv.append(h3);
    const p = document.createElement('p');
    p.textContent = cardDescription;
    const a = document.createElement('a');
    a.setAttribute('href', cardHref);
    a.textContent = cardLinkText;
    p.append(a);
    rightDiv.append(p);
    cards.push([leftDiv, rightDiv]);
  }
};

const createCards = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((fl) => {
    const cards = [];
    const cells = [];
    const threeColumn = fl.querySelectorAll('grid[columns="3"] > template');
    const fourColumn = fl.querySelectorAll('grid[columns="4"] > template');
    if (threeColumn.length > 0) {
      threeColumn.forEach((tmp) => {
        card(tmp, cards, document);
      });
      cells.push(['Cards (articlecard) ']);
    }

    if (fourColumn.length > 0) {
      fourColumn.forEach((tmp) => {
        card(tmp, cards, document);
      });
      cells.push(['Cards (articlecard, cols-4)']);
    }

    cells.push(...cards);

    if (cards.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      fl.append(block);
    }
  });
};
export default createCards;
