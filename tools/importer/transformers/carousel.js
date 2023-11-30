/* global WebImporter */
const createCarousel = (main, document) => {
  const carousel = main.querySelector('home-carousel');
  if (carousel) {
    const cells = [];
    // eslint-disable-next-line no-undef
    const carouselLists = JSON.parse(decodeHtmlEntities(carousel.getAttribute('slidedata')));
    cells.push(['carousel']);
    const carousels = carouselLists.map((list) => {
      const rightDiv = document.createElement('div');
      const title = document.createElement('p');
      title.innerHTML = list.title;
      if (list.title) rightDiv.append(title);
      const description = document.createElement('p');
      description.innerHTML = list.description;
      if (list.description) rightDiv.append(description);
      const btnText1 = list.btntitle1;
      const btnhref1 = list.btn1path;
      const rfqBtn1 = list.buttonRFQOne;
      if (btnText1) {
        const p1 = document.createElement('p');
        const a1 = document.createElement('a');
        a1.setAttribute('href', rfqBtn1 ? '#request-quote' : btnhref1);
        a1.textContent = btnText1;
        p1.append(a1);
        rightDiv.append(p1);
      }
      const btnText2 = list.btntitle2;
      const btnhref2 = list.btn2path;
      const rfqBtn2 = list.buttonRFQTwo;
      if (btnText2) {
        const p2 = document.createElement('p');
        const a2 = document.createElement('a');
        a2.setAttribute('href', rfqBtn2 ? '#request-quote' : btnhref2);
        a2.textContent = btnText2;
        p2.append(a2);
        rightDiv.append(p2);
      }

      const leftDiv = document.createElement('div');
      const img = document.createElement('img');
      const altText = list.imgalt;
      img.setAttribute('src', list.image);
      if (altText) {
        img.setAttribute('alt', altText);
      } else {
        img.setAttribute('alt', 'Danaher Corporation');
      }
      leftDiv.append(img);
      return [rightDiv, leftDiv];
    });
    cells.push(...carousels);
    const block = WebImporter.DOMUtils.createTable(cells, document);
    carousel.append(block);
  }
};

export default createCarousel;
