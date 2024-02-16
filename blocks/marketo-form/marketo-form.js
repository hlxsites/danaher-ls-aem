// eslint-disable no-console
/**
 * Adds a Marketo form to the specified block element.
 * @param {HTMLElement} block - The block element to which the Marketo form will be added.
 * @returns {Promise<void>} - A promise that resolves once the Marketo form is added.
 */
const addMarketoForm = async (block) => {
  const tmpFormName = block.firstElementChild;
  const formName = tmpFormName.firstElementChild.nextElementSibling.innerHTML;
  const data = await fetch(`${window.hlx.codeBasePath}/blocks/marketo-form/forms/${formName}.html`);

  if (!data.ok) {
    /* eslint-disable-next-line no-console */
    console.error(`failed to load form: ${formName}`);
    block.innerHTML = '';
    return;
  }

  block.innerHTML = await data.text();

  // loading scripts one by one to prevent inappropriate script execution order.
  // eslint-disable-next-line no-restricted-syntax
  for (const script of [...block.querySelectorAll('script')]) {
    let waitForLoad = Promise.resolve();
    const newScript = document.createElement('script');
    newScript.setAttribute('type', 'text/javascript');
    script.getAttributeNames().forEach((attrName) => {
      const attrValue = script.getAttribute(attrName);
      newScript.setAttribute(attrName, attrValue);
      if (attrName === 'src') {
        waitForLoad = new Promise((resolve) => {
          newScript.addEventListener('load', resolve);
        });
      }
    });
    newScript.innerHTML = script.innerHTML;
    script.remove();
    document.body.append(newScript);

    // eslint-disable-next-line no-await-in-loop
    await waitForLoad;
  }

  block.querySelectorAll('.form-element-layout').forEach((el) => {
    // displaying label content as input placeholder
    const input = el.querySelector('input[type="text"], select, textarea');
    const label = el.querySelector('label');
    if (input && label) {
      input.setAttribute('placeholder', label.innerText.replace(/\s+/g, ' ').trim());
      label.remove();
    }
  });
};

export default async function decorate(block) {
  addMarketoForm(block);
}
