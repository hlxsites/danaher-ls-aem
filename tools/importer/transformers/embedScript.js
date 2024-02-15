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
          const divFormEl = document.createElement('div');
          const divFormThankYouEl = document.createElement('div');
          if (index === 0) {
            divFormEl.textContent = form?.getAttribute('id');
            forms.push([['Marketo'], divFormEl]);
          } else {
            divFormThankYouEl.textContent = form?.getAttribute('id');
            forms.push([['Thankyou'], divFormThankYouEl]);
          }
        });
        const cells = [['Marketo Form'], ...forms];
        const block = WebImporter.DOMUtils.createTable(cells, document);
        scriptEl.innerHTML = '';
        scriptEl.append(block);
      }
    });
  }
};
export default embedScript;
