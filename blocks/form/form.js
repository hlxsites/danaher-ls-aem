import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const model = block.model || {};
  const formTitle = model.formTitle || 'Talk to an Expert';
  const successUrl = model.successUrl || '';
  const errorUrl = model.errorUrl || '';
  const fields = model.fields || [];

  const formWrapper = div({ class: 'form-wrapper' });
  const form = document.createElement('form');
  form.method = 'post';
  form.name = 'TTAE';
  form.id = 'TTAE';
  form.action = 'https://cl.s13.exct.net/DEManager.aspx';

  // Hidden fields
  const hiddenFields = [
    { name: '_clientID', value: '546006278' },
    { name: '_deExternalKey', value: 'TTAE' },
    { name: '_action', value: 'add' },
    { name: '_returnXML', value: '1' },
    { name: 'Inquiry_Type', value: formTitle },
    { name: '_successURL', value: successUrl },
    { name: '_errorURL', value: errorUrl },
  ];
  hiddenFields.forEach(({ name, value }) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  // Dynamic fields from model
  fields.forEach((field) => {
    const fieldWrapper = div({ class: 'form-field' });

    if (field.type !== 'checkbox') {
      const label = document.createElement('label');
      label.setAttribute('for', field.name);
      label.textContent = field.label || '';
      if (field.required) label.innerHTML += ' <span class="required">*</span>';
      fieldWrapper.appendChild(label);
    }

    let input;
    switch (field.type) {
      case 'textarea':
        input = document.createElement('textarea');
        break;
      case 'select':
        input = document.createElement('select');
        (field.options || '').split('\n').forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.trim();
          option.textContent = opt.trim();
          input.appendChild(option);
        });
        break;
      case 'checkbox':
        input = document.createElement('input');
        input.type = 'checkbox';
        input.name = field.name;
        input.id = field.name;
        if (field.required) input.required = true;

        const label = document.createElement('label');
        label.htmlFor = field.name;
        label.innerHTML = ` ${field.label || ''}`;
        label.prepend(input);

        fieldWrapper.appendChild(label);
        form.appendChild(fieldWrapper);
        return;

      default:
        input = document.createElement('input');
        input.type = field.type || 'text';
        break;
    }

    input.name = field.name;
    input.id = field.name;
    if (field.required) input.required = true;

    fieldWrapper.appendChild(input);
    form.appendChild(fieldWrapper);
  });

  // Submit
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Submit';
  submit.className = 'submit-button';
  form.appendChild(submit);

  // Append form
  formWrapper.appendChild(form);
  block.innerHTML = '';
  block.appendChild(formWrapper);
}
