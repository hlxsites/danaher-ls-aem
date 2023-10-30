/* global WebImporter */
const createCards = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((fl) => {
    const cards = [];
    fl.querySelectorAll('grid[columns="3"] > template').forEach((tmp) => {
      const h2 = tmp.content.querySelector('h2');
      const articleCard = tmp.content.querySelector('articlecard');
      if (articleCard) {
        const cardImg = articleCard.getAttribute('cardimg');
        const altText = articleCard.getAttribute('imagealttext');
        const cardTitle = articleCard.getAttribute('cardtitle');
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
    });
    const cells = [
      ['Cards (articlecard)'],
      ...cards,
    ];

    if (cards.length > 0) {
      fl.before(document.createElement('hr'));
      const block = WebImporter.DOMUtils.createTable(cells, document);
      fl.append(block);
    }
  });
};
export default createCards;
