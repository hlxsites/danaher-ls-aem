/* global WebImporter */
const createCTA = (main, document) => {
  const ctaSection = main.querySelector('CTAsection');
  if (ctaSection) {
    const title = ctaSection.getAttribute('title');
    const btnText1 = ctaSection.getAttribute('btntext1');
    const rfqBtn1 = ctaSection.getAttribute('rfqbtn1');
    const btnhref1 = ctaSection.getAttribute('btnhref1');
    const btnText2 = ctaSection.getAttribute('btntext2');
    const rfqBtn2 = ctaSection.getAttribute('rfqbtn2');
    const btnhref2 = ctaSection.getAttribute('btnhref2');
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = title;
    if (h2) {
      div.append(h2);
    }
    const btn1 = document.createElement('button');
    btn1.textContent = btnText1;
    if (rfqBtn1 && btn1.textContent) {
      div.append(btn1);
    }
    if (btnhref1 && btn1.textContent) {
      div.append(btn1);
    }
    const btn2 = document.createElement('button');
    btn2.textContent = btnText2;
    if (rfqBtn2 && btn2.textContent) {
      div.append(btn2);
    }
    if (btnhref2 && btn2.textContent) {
      div.append(btn2);
    }

    const cells = [
      ['call-to-action'],
      [div],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    ctaSection.append(block);
  }
};
export default createCTA;
