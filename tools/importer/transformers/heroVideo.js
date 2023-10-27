/* global WebImporter */
const createHero = (main, document) => {
  const heroVideo = main.querySelector('herovideoplayer');
  if (heroVideo) {
    const title = heroVideo.getAttribute('title');
    const description = heroVideo.getAttribute('description');
    const percentage = heroVideo.getAttribute('percentage');
    const ctaText = heroVideo.getAttribute('btntext');
    const videoid = heroVideo.getAttribute('videoid');
    const imgSrc = 'https://danaherls.scene7.com/is/image/danaher/hero-image?$danaher-transparent$';
    const imgAlt = heroVideo.getAttribute('imagealt');

    const img = document.createElement('img');
    img.setAttribute('src', imgSrc);
    img.setAttribute('alt', imgAlt);

    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = title;
    div.append(h2);
    const p1 = document.createElement('p');
    p1.textContent = description;
    div.append(p1);
    const p2 = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = percentage;
    p2.append(strong);
    div.append(p2);
    const p3 = document.createElement('p');
    const videoElemHTML = `<a href="https://player.vimeo.com/video/${videoid}?loop=1&app_id=122963">${ctaText}</a>`;
    p3.innerHTML = videoElemHTML;
    div.append(p3);

    const cells = [
      ['Hero'],
      [img, div],
    ];

    const block = WebImporter.DOMUtils.createTable(cells, document);
    heroVideo.append(block);
  }
};
export default createHero;
