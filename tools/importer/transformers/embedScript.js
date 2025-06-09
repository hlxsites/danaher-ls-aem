/* global WebImporter */
const marketoFormIds = (form, forms, document, index) => {
  const formIdEl = document.createElement('div');
  const thankYouIdEl = document.createElement('div');
  if (index === 0) {
    formIdEl.textContent = form?.getAttribute('id');
    forms.push([['marketo'], formIdEl]);
  } else {
    thankYouIdEl.textContent = form?.getAttribute('id');
    forms.push([['thankyou'], thankYouIdEl]);
  }
};

const marketoForm = (scriptEl, forms, document) => {
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
};

const sfdcForm = (form, forms, document) => {
  const formId = document.createElement('div');
  const formName = document.createElement('div');
  formId.textContent = form?.getAttribute('id');
  forms.push([['id'], formId]);
  formName.textContent = form?.getAttribute('name');
  forms.push([['name'], formName]);
  form.querySelectorAll('input[type="hidden"]').forEach((field) => {
    if (field?.value !== '') {
      forms.push([[field?.name], field?.value]);
    }
  });
};

const tileViewerBlock = (scriptEl, document) => {
  const tileDiv = scriptEl.querySelector('div.tile-config');
  if (tileDiv) {
    const tileId = tileDiv.getAttribute('data-tile-id') || 'tile-default';
    const tileSrc =scriptEl.querySelector('script')?.getAttribute('src');
    const tileTitle = scriptEl.querySelector('script')?.getAttribute('data-tile-title');

    if (tileSrc) {
      const cells = [
        ['tiled-viewer'],
        ['tile-src', tileSrc],
        ['tile-title', tileTitle],
      ];
      const block = WebImporter.DOMUtils.createTable(cells, document);
      scriptEl.innerHTML = '';
      scriptEl.append(block);
    }
  }
};

const embedScript = (main, document) => {
  const scriptEls = main.querySelectorAll('div.script');
  if (scriptEls.length > 0) {
    scriptEls.forEach((scriptEl) => {
      if (scriptEl.classList.contains('tile-config')) {
        const tileId = scriptEl.getAttribute('data-tile-id');
        const tileTitle = scriptEl.getAttribute('data-tile-title') || '';
        const tileSrc = scriptEl.getAttribute('data-tile-src');

        if (tileSrc) {
          const cells = [
            ['tiled-viewer'],
            ['tile-src', tileSrc],
            ['tile-title', tileTitle],
          ];
          const block = WebImporter.DOMUtils.createTable(cells, document);
          scriptEl.innerHTML = '';
          scriptEl.append(block);
        }
        return;
      }

      if (scriptEl.querySelector('div#add-section')?.id === 'add-section') {
        scriptEl.innerHTML = '';
        scriptEl.append(document.createElement('hr'));
      }
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
      let formName = '';
      const mktoForms = scriptEl.querySelectorAll('form');
      if (mktoForms.length > 0) {
        mktoForms.forEach((form, index) => {
          if (form?.getAttribute('id') === 'TTAE') {
            sfdcForm(form, forms, document);
            formName = 'Talk to an Expert Form';
          } else if (form?.getAttribute('id') === 'labinquiry') {
            sfdcForm(form, forms, document);
            formName = 'Join Today Form';
          } else {
            marketoFormIds(form, forms, document, index);
            formName = 'Marketo Form';
          }
        });
        if (formName === 'Marketo') marketoForm(scriptEl, forms, document);
        const cells = [[`${formName}`], ...forms];
        const block = WebImporter.DOMUtils.createTable(cells, document);
        scriptEl.innerHTML = '';
        scriptEl.append(block);
      }
      tileViewerBlock(scriptEl, document);
    });
  }
};
export default embedScript;
