/* global WebImporter */
const createWorkflowCarousel = (main, document) => {
  const carousel = main.querySelector('workflow-carousel');
  const cells = [];
  if (carousel) {
    try {
      // eslint-disable-next-line no-undef
      const carouselLists = JSON.parse(decodeHtmlEntities(carousel.getAttribute('slidedata')));
      if (carouselLists.length > 0) cells.push(['Workflow Carousel']);
      const slides = carouselLists.map((slide) => {
        const leftDivEL = document.createElement('div');
        const divEL = document.createElement('div');
        const rightDivEL = document.createElement('div');

        const { image } = slide;
        if (image) {
          const img = document.createElement('img');
          img.src = image;
          img.alt = 'Danaher Corporation';
          leftDivEL.append(img);
        }

        if (slide.type) rightDivEL.textContent = slide.type;

        const cat = document.createElement('div');
        const catStrong = document.createElement('strong');
        catStrong.textContent = slide.category;
        cat.append(catStrong);
        if (slide.category) divEL.append(cat);

        const title = document.createElement('div');
        title.innerHTML = slide.title;
        if (slide.title) divEL.append(title);

        const { link } = slide;
        if (link) {
          const anc = document.createElement('a');
          anc.title = 'link';
          anc.href = link;
          anc.textContent = 'Explore';
          divEL.append(anc);
        }

        return [leftDivEL, divEL, rightDivEL];
      });

      cells.push(...slides);

      const block = WebImporter.DOMUtils.createTable(cells, document);
      carousel.append(block);

      const carouselLink = document.createElement('a');
      carouselLink.textContent = carousel.getAttribute('text');
      carouselLink.href = carousel.getAttribute('link');
      carouselLink.title = 'link';
      block.prepend(carouselLink);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
};

export default createWorkflowCarousel;
