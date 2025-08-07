export default function decorate(block) {
  // Clear block before rendering
  block.innerHTML = '';

  // Create a wrapper div
  const wrapper = document.createElement('div');
  wrapper.className = 'form-wrapper';

  // You should load your model from metadata or embedded JSON here
  const formConfig = {
    action: 'https://cl.s13.exct.net/DEManager.aspx',
    method: 'POST',
    fields: [
      { name: 'First_Name', label: 'First name', required: true, type: 'text' },
      { name: 'Last_Name', label: 'Last name', required: true, type: 'text' },
      { name: 'Email_Address', label: 'Email address', required: true, type: 'email' },
      { name: 'Phone_Number', label: 'Phone number', type: 'tel' },
      { name: 'Company_Name', label: 'Company name', required: true, type: 'text' },
      {
        name: 'Job_Role',
        label: 'Job Role',
        required: true,
        type: 'select',
        options: [
          { label: 'Select', value: '' },
          { label: 'Graduate Student', value: 'Graduate Student' },
          { label: 'Academia', value: 'Academia' },
        ],
      },
      {
        name: 'Country',
        label: 'Country',
        required: true,
        type: 'select',
        options: [
          { label: 'Select', value: '' },
          { label: 'Yemen', value: 'Yemen' },
          { label: 'Zambia', value: 'Zambia' },
          { label: 'Zimbabwe', value: 'Zimbabwe' },
        ],
      },
      { name: 'Postal_Code', label: 'ZIP / Postal Code', required: true, type: 'text' },
      { name: 'OpCo_Comments', label: 'Additional information', type: 'textarea' },
      {
        name: 'Email_Opt_In',
        label: 'I would like to receive more information via email...',
        type: 'checkbox',
      },
    ],
  };

  const form = document.createElement('form');
  form.action = formConfig.action;
  form.method = formConfig.method;

  formConfig.fields.forEach((field) => {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field';

    const label = document.createElement('label');
    label.textContent = field.label + (field.required ? ' *' : '');
    label.setAttribute('for', field.name);

    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      field.options.forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        input.appendChild(option);
      });
    } else if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 4;
    } else if (field.type === 'checkbox') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.value = 'true';
      fieldWrapper.appendChild(input);
      fieldWrapper.appendChild(label);
      form.appendChild(fieldWrapper);
      return;
    } else {
      input = document.createElement('input');
      input.type = field.type || 'text';
    }

    input.name = field.name;
    if (field.required) input.required = true;

    fieldWrapper.appendChild(label);
    fieldWrapper.appendChild(input);
    form.appendChild(fieldWrapper);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Submit';
  submit.className = 'submit-btn';
  form.appendChild(submit);

  wrapper.appendChild(form);
  block.appendChild(wrapper);
}
