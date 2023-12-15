/* global WebImporter */
const getCarousel = (carousel, cells, document) => {
  // eslint-disable-next-line no-undef
  const carouselLists = JSON.parse(decodeHtmlEntities(carousel.getAttribute('slidedata')));
  cells.push(['carousel']);
  const slides = carouselLists.map((slide) => {
    const rightDiv = document.createElement('div');
    const brandDiv = document.createElement('div');
    brandDiv.textContent = slide.brandText;
    if (slide.brandText) rightDiv.append(brandDiv);
    const title = document.createElement('h2');
    title.innerHTML = slide.title;
    if (slide.title) rightDiv.append(title);
    const description = document.createElement('p');
    description.innerHTML = slide.description;
    if (slide.description) rightDiv.append(description);
    const btnText1 = slide.btntitle1;
    const btnhref1 = slide.btn1path;
    const rfqBtn1 = slide.buttonRFQOne;
    const asLink1 = slide.appearLink1;
    if (btnText1) {
      const p1 = document.createElement('p');
      const a1 = document.createElement('a');
      if (asLink1) a1.title = 'link';
      a1.setAttribute('href', rfqBtn1 ? '#request-quote' : btnhref1);
      a1.textContent = btnText1;
      p1.append(a1);
      rightDiv.append(p1);
    }
    const btnText2 = slide.btntitle2;
    const btnhref2 = slide.btn2path;
    const rfqBtn2 = slide.buttonRFQTwo;
    const asLink2 = slide.appearLink2;
    if (btnText2) {
      const p2 = document.createElement('p');
      const a2 = document.createElement('a');
      if (asLink2) a2.title = 'link';
      a2.setAttribute('href', rfqBtn2 ? '#request-quote' : btnhref2);
      a2.textContent = btnText2;
      p2.append(a2);
      rightDiv.append(p2);
    }

    const leftDiv = document.createElement('div');
    const img = document.createElement('img');
    const altText = slide.imgalt;
    img.setAttribute('src', slide.image);
    if (altText) {
      img.setAttribute('alt', altText);
    } else {
      img.setAttribute('alt', 'Danaher Corporation');
    }
    leftDiv.append(img);
    return [rightDiv, leftDiv];
  });
  cells.push(...slides);
};

const createCarousel = (main, document) => {
  const carousels = main.querySelectorAll('home-carousel');
  if (carousels) {
    carousels.forEach((carousel, i) => {
      const cells = [];
      getCarousel(carousel, cells, document);
      const block = WebImporter.DOMUtils.createTable(cells, document);
      carousel.append(block);
      if (i === carousels.length - 1 && !carousel.parentNode.nextElementSibling) carousel.prepend(document.createElement('hr'));
      else carousel.append(document.createElement('hr'));
    });
  }
};

export default createCarousel;
