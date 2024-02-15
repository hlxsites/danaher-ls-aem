/* global WebImporter */
const embedScript = (main, document) => {
  const scriptEl = main.querySelectorAll('div.script');
  if (scriptEl.length > 0) {
    scriptEl.forEach((scrpt) => {
      const iFrame = scrpt.querySelector('iframe');
      if (iFrame) {
        const anc = document.createElement('a');
        anc.textContent = iFrame.getAttribute('title');
        anc.href = iFrame.getAttribute('src');

        const cells = [['embed'], [anc]];
        const block = WebImporter.DOMUtils.createTable(cells, document);
        scrpt.innerHTML = '';
        scrpt.append(block);
      }

      const forms = [];
      const mktoForms = scrpt.querySelectorAll('form');
      if (mktoForms.length > 0) {
        mktoForms.forEach((form, index) => {
          const divFormEl = document.createElement('div');
          const divFormThankYouEl = document.createElement('div');
          if (index === 0) {
            divFormEl.textContent = form?.getAttribute('id');
            forms.push([['Marketo'], divFormEl]);
          } else {
            divFormThankYouEl.textContent = form?.getAttribute('id');
            forms.push([['Thank you'], divFormThankYouEl]);
          }
        });
        const cells = [['Marketo Form'], ...forms];
        const block = WebImporter.DOMUtils.createTable(cells, document);
        scrpt.innerHTML = '';
        scrpt.append(block);
      }
    });
  }
};
export default embedScript;
