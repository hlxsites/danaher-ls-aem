/* global WebImporter */
const embedScript = (main, document) => {
  const scriptEls = main.querySelectorAll('div.script');
  if (scriptEls.length > 0) {
    scriptEls.forEach((scriptEl) => {
      const iFrame = scriptEl.querySelector('iframe');
      if (iFrame) {
        const anc = document.createElement('a');
        anc.textContent = iFrame.getAttribute('title');
        anc.href = iFrame.getAttribute('src');

        const cells = [['embed'], [anc]];
        const block = WebImporter.DOMUtils.createTable(cells, document);
        scriptEl.innerHTML = '';
        scriptEl.append(block);
      }

      const forms = [];
      const mktoForms = scriptEl.querySelectorAll('form');
      if (mktoForms.length > 0) {
        mktoForms.forEach((form, index) => {
          const formIdEl = document.createElement('div');
          const thankYouIdEl = document.createElement('div');
          if (index === 0) {
            formIdEl.textContent = form?.getAttribute('id');
            forms.push([['marketo'], formIdEl]);
          } else {
            thankYouIdEl.textContent = form?.getAttribute('id');
            forms.push([['thankyou'], thankYouIdEl]);
          }
        });
        const pEls = scriptEl?.querySelector('div.mktoForm > div#thankyou');
        const firstPEl = pEls?.firstElementChild;
        if (firstPEl) {
          const h2El = document.createElement('h2');
          h2El.textContent = firstPEl?.innerHTML;
          forms.push([h2El]);
        }
        const secondPEl = pEls?.firstElementChild?.nextElementSibling;
        if (secondPEl) {
          const strongEl = document.createElement('strong');
          strongEl.textContent = secondPEl?.innerHTML;
          forms.push([strongEl]);
        }
        const thirdPEl = pEls?.lastElementChild;
        if (thirdPEl) {
          const pEl = document.createElement('p');
          pEl.textContent = thirdPEl?.innerHTML;
          forms.push([pEl]);
        }
        const cells = [['Marketo Form'], ...forms];
        const block = WebImporter.DOMUtils.createTable(cells, document);
        scriptEl.innerHTML = '';
        scriptEl.append(block);
      }
    });
  }
};
export default embedScript;
