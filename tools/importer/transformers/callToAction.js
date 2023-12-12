/* global WebImporter */
export const c2a = (cta, document) => {
  const ctaSection = cta.querySelector('CTAsection');
  if (ctaSection) {
    const title = ctaSection.getAttribute('title');
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = title;
    if (h2) {
      div.append(h2);
    }

    const btnText1 = ctaSection.getAttribute('btntext1');
    const rfqBtn1 = ctaSection.getAttribute('rfqbtn1');
    const btnhref1 = ctaSection.getAttribute('btnhref1');
    if (btnText1) {
      const p1 = document.createElement('p');
      const a1 = document.createElement('a');
      a1.setAttribute('href', rfqBtn1 ? '#request-quote' : btnhref1);
      a1.textContent = btnText1;
      p1.append(a1);
      div.append(p1);
    }

    const btnText2 = ctaSection.getAttribute('btntext2');
    const rfqBtn2 = ctaSection.getAttribute('rfqbtn2');
    const btnhref2 = ctaSection.getAttribute('btnhref2');
    if (btnText2) {
      const p2 = document.createElement('p');
      const a2 = document.createElement('a');
      a2.setAttribute('href', rfqBtn2 ? '#request-quote' : btnhref2);
      a2.textContent = btnText2;
      p2.append(a2);
      div.append(p2);
    }
    const cells = [
      ['call-to-action'], [div],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    cta.append(block);
  }
};

const createCTA = (main, document) => {
  const ctaSection = main.querySelectorAll('div.cta-section');
  [...ctaSection].forEach((cta) => {
    c2a(cta, document);
  });
};

export default createCTA;
