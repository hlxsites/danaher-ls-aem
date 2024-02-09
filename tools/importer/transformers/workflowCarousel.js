/* global WebImporter */
const createWorkflowCarousel = (main, document) => {
  const carousel = main.querySelector('workflow-carousel');
  const cells = [];
  if(carousel){
    try{
      // eslint-disable-next-line no-undef
      const carouselLists = JSON.parse(decodeHtmlEntities(carousel.getAttribute('slidedata')));
      cells.push(['Workflow Carousel']);
      const slides = carouselLists.map((slide) => {
        const rightDiv = document.createElement('div');
  
        const { image } = slide;
        if (image) {
          const img = document.createElement('img');
          img.src = image;
          img.alt = 'Danaher Corporation';
          rightDiv.append(img);
        }
  
        const title = document.createElement('div');
        title.innerHTML = slide.title;
        if (slide.title) rightDiv.append(title);
  
        const { link } = slide;
        if (link) {
          const anc = document.createElement('a');
          anc.href = link;
          anc.textContent = 'Explore';
          rightDiv.append(anc);
        }
  
        const leftDiv = document.createElement('div');
        const cat = document.createElement('div');
        cat.textContent = slide.category;
        if (slide.category) leftDiv.append(cat);
  
        return [leftDiv, rightDiv];
      });
      const carouselLink = document.createElement('a');
      carouselLink.textContent = carousel.getAttribute('text');
      carouselLink.href = carousel.getAttribute('link');
      cells.push([carouselLink]);
      cells.push(...slides);
  
      const block = WebImporter.DOMUtils.createTable(cells, document);
      carousel.append(block);
    }catch(e){
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
};

export default createWorkflowCarousel;
