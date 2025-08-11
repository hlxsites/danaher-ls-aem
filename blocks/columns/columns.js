import {
  a, div, form, input, label, span, strong,
} from '../../scripts/dom-builder.js';
import {
  decorateIcons,
} from '../../scripts/lib-franklin.js';
import decorateFormBlock from '../../blocks/form/form.js';

/** *****JOIN-TODAY FORM Starts ******* */

const countries = ['Select', 'United States', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cape Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic',
  'Chad', 'Channel Islands', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Cote d Ivoire', 'Denmark',
  'Djibouti', 'Dominica', 'Dominican Republic', 'DR Congo', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Faeroe Islands', 'Finland', 'France', 'French Guiana', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece',
  'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Korea', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal',
  'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea',
  'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Timor-Leste', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

const jobRole = ['Select', 'C-Suite', 'Vice President', 'Associate Vice President', 'Executive Director', 'Director', 'Department Head / Group Lead', 'Principal Scientist',
  'Operations Manager', 'Lab Manager', 'Senior Scientist', 'Scientist', 'Associate Scientist', 'Graduate Student', 'Academia'];

const buildInputElement = (lable, field, inputType, inputName, autoCmplte, required, dtName) => {
  const dataRequired = required ? span({ class: 'text-red-500' }, '*') : '';
  return div(
    { class: 'space-y-2' },
    label(
      { for: lable, class: 'font-normal text-sm leading-4' },
      field,
      dataRequired,
    ),
    input(
      {
        type: inputType,
        name: inputName,
        autocomplete: autoCmplte,
        'data-required': required,
        class: 'input-focus text-base w-full block px-2 py-4 text-gray-600 font-extralight border border-solid border-gray-300',
        'aria-label': inputName,
      },
    ),
    span(
      { id: 'msg', 'data-name': dtName, class: 'mt-1 text-sm font-normal leading-4 text-danaherpurple-500' },
    ),
  );
};

function createDropdown(itemsList) {
  // Ensure itemsList is an array without reassigning the parameter
  const items = Array.isArray(itemsList) ? itemsList : [itemsList];
  const list = document.createElement('ul');
  list.classList.add(...'absolute w-full max-h-48 overflow-scroll hidden peer-checked:block z-10 bg-white py-2 text-sm text-gray-700 rounded-lg shadow'.split(' '));
  items.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add(...'block px-4 py-2 hover:bg-danaherpurple-50 cursor-pointer'.split(' '));
    li.textContent = item;
    list.append(li);
  });
  return list;
}

function buildSelectElement(lableFor, fieldName, inputType, inputId, dataName, inputList) {
  const selectIcon = div(
    { class: 'space-y-2' },
    label(
      {
        for: lableFor,
        class: 'font-normal text-sm leading-4',
      },
      fieldName,
      span({ class: 'text-red-500' }, '*'),
    ),
    div(
      { class: 'relative bg-white' },
      input(
        {
          type: inputType,
          id: inputId,
          class: 'peer hidden',
        },
      ),
      label(
        {
          for: inputId,
          class: 'w-full flex justify-between items-center p-4 text-base text-gray-600 font-extralight border border-solid border-gray-300 cursor-pointer focus:outline-none focus:ring-danaherpurple-500',
        },
        span({ class: 'text-gray-600' }, 'Select'),
        span({ class: 'icon icon-dropdown w-3 h-3' }),
      ),
      createDropdown(inputList),
      span(
        {
          id: 'msg',
          'data-name': dataName,
          class: 'mt-1 text-sm font-normal leading-4 text-danaherpurple-500',
        },
      ),
    ),
  );
  return selectIcon;
}

const buildCheckboxElement = (lable, field, inputType, inputName, value, required) => div(
  { class: 'flex items-baseline' },
  input(
    {
      type: inputType,
      name: inputName,
      class: 'input-focus-checkbox',
      value,
      'data-required': required,
      'aria-label': inputName,
    },
  ),
  label(
    {
      for: lable,
      class: 'pl-2',
    },
    field,
  ),
);

// Create a group of radio button options
const buildOptionsElement = (name, options, required = false) => div(
  { class: 'flex flex-col gap-2' },
  ...options.map((opt) => div(
    { class: 'flex items-baseline' },
    input({
      type: 'radio',
      name,
      value: opt.value,
      id: `${name}_${opt.value}`,
      'data-required': required,
      class: 'input-focus-radio',
      'aria-label': name,
    }),
    label(
      { for: `${name}_${opt.value}`, class: 'pl-2' },
      opt.label,
    ),
  )),
);

function tnc() {
  const tncEl = div(
    { class: 'flex items-center mt-5' },
    span(
      {
        style: 'font-family: helvetica, arial, sans-serif; font-size: 13px;',
      },
      'Please tick below if you would like Danaher Life Sciences and the Danaher group of companies listed ',
      strong(
        a({
          'aria-label': 'Link Terms of Use',
          title: 'https://www.danaher.com/business-directory',
          href: 'https://www.danaher.com/business-directory',
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-[#333333] underline',
          tabindex: '-1',
        }, 'here '),
      ),
      span('to contact you with personalized information about goods and services, that may be of interest to you based on our analysis of your interactions with us and other information and to check to see if you’ve opened messages from us. To withdraw consent to marketing that you already receive from a Danaher group company, you should contact that company or click the unsubscribe in emails you receive. '),
      span(' For more information please review our '),
      strong(
        a(
          {
            'aria-label': 'Link Privacy Policy',
            title: 'https://lifesciences.danaher.com/us/en/legal/privacy-policy.html',
            href: 'https://lifesciences.danaher.com/us/en/legal/privacy-policy.html',
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'text-[#333333] underline',
            tabindex: '-1',
          },
          'Privacy Policy.',
        ),
      ),
      div(
        { class: 'flex items-center mt-5' },
        span(' Please send me communications by: '),
      ),
    ),
  );
  return tncEl;
}

function getInquiry(formId) {
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getUTCDate()).padStart(2, '0');
  const hour = String(currentDate.getUTCHours()).padStart(2, '0');
  const min = String(currentDate.getUTCMinutes()).padStart(2, '0');
  const sec = String(currentDate.getUTCSeconds()).padStart(2, '0');
  const milli = String(currentDate.getUTCMilliseconds()).padStart(3, '0');
  const inquiry = year + month + day + hour + min + sec + milli;
  document.getElementsByName('Inquiry_Number')[0].value = inquiry;
  // eslint-disable-next-line
  window.dataLayer?.push({ event: 'formSubmit', formId, inquiry });
}

function formValidate() {
  let isValid = true;
  document.querySelectorAll('[data-required]').forEach((el) => {
    if (el.dataset.required === 'true') {
      const msgEl = document.querySelector(`[data-name=${el.name}]`);
      if (msgEl !== null) {
        if (el.value.length === 0) {
          msgEl.innerHTML = 'This field is required';
          isValid = false;
        } else {
          msgEl.innerHTML = '';
        }
      }
    }
  });
  return isValid;
}

function loadUTMParams() {
  document.getElementsByName('UTM_Content')[0].value = localStorage.getItem('danaher_utm_content');
  if (window.location.pathname.includes('new-lab')) {
    document.getElementsByName('UTM_Campaign')[0].value = 'memoryblue';
  } else {
    document.getElementsByName('UTM_Campaign')[0].value = localStorage.getItem('danaher_utm_campaign');
  }
  document.getElementsByName('UTM_Medium')[0].value = localStorage.getItem('danaher_utm_medium');
  document.getElementsByName('UTM_Term')[0].value = localStorage.getItem('danaher_utm_term');
  document.getElementsByName('UTM_Source')[0].value = localStorage.getItem('danaher_utm_source');
  document.getElementsByName('UTM_NLC')[0].value = localStorage.getItem('danaher_utm_nlc');
  document.getElementsByName('Page_Track_URL')[0].value = localStorage.getItem('danaher_utm_previouspage');
}

async function loadForm(row, tags) {
  row.classList.add('relative');
  let formId = '';
  let formName = '';
  let clientId = '';
  let deExternalKey = '';
  let action = '';
  let inquiryType = '';
  let formType = '';
  let returnXML = '';
  let successUrl = '';
  let errorUrl = '';
  tags.forEach((ele, index) => {
    if (index === 0) {
      formId = ele.textContent;
    }
    if (index === 1) {
      formName = ele.textContent;
    }
    if (index === 2) {
      clientId = ele.textContent;
    }
    if (index === 3) {
      deExternalKey = ele.textContent;
    }
    if (index === 4) {
      action = ele.textContent;
    }
    if (index === 5) {
      returnXML = ele.textContent;
    }
    if (index === 6) {
      inquiryType = ele.textContent;
    }
    if (index === 7) {
      formType = ele.textContent;
    }
    if (index === 8) {
      successUrl = ele.textContent;
    }
    if (index === 9) {
      errorUrl = ele.textContent;
    }
  });
  const formEl = div(
    { class: 'relative my-2 mx-0 md:ml-2' },
    form(
      {
        id: `${formId}`,
        name: `${formName}`,
        action: 'https://cl.s13.exct.net/DEManager.aspx',
        method: 'post',
        class: 'text-sm w-full max-w-4xl box-border overflow-hidden rounded-xl my-0 mx-auto p-6',
        style: 'background: linear-gradient(180deg, rgba(245,245,245,1) 0%, rgba(255,255,255,1) 100%;',
      },
      input({ type: 'hidden', name: '_clientID', value: `${clientId}` }),
      input({ type: 'hidden', name: '_deExternalKey', value: `${deExternalKey}` }),
      input({ type: 'hidden', name: '_action', value: `${action}` }),
      input({ type: 'hidden', name: '_returnXML', value: `${returnXML}` }),
      input({ type: 'hidden', name: 'Inquiry_Type', value: `${inquiryType}` }),
      input({ type: 'hidden', name: 'Inquiry_Number' }),
      input({ type: 'hidden', name: 'Form_Type', value: `${formType}` }),
      input({ type: 'hidden', name: 'Job_Role', 'data-required': true }),
      input({ type: 'hidden', name: 'UTM_Content' }),
      input({ type: 'hidden', name: 'UTM_Campaign' }),
      input({ type: 'hidden', name: 'UTM_Medium' }),
      input({ type: 'hidden', name: 'UTM_Term' }),
      input({ type: 'hidden', name: 'UTM_Source' }),
      input({ type: 'hidden', name: 'UTM_NLC' }),
      input({ type: 'hidden', name: 'Page_Track_URL' }),
      input({ type: 'hidden', name: 'Country', 'data-required': true }),
      input({ type: 'hidden', name: '_successURL', value: `${successUrl}` }),
      input({ type: 'hidden', name: '_errorURL', value: `${errorUrl}` }),
      div(
        { class: 'container mx-auto space-y-4' },
        buildInputElement('First_Name', 'First Name', 'text', 'First_Name', 'given-name', true, 'First_Name'),
        buildInputElement('Last_Name', 'Last Name', 'text', 'Last_Name', 'family-name', true, 'Last_Name'),
        buildInputElement('Email_Address', 'Email Address', 'text', 'Email_Address', 'email', true, 'Email_Address'),
        buildInputElement('Phone_Number', 'Phone Number', 'text', 'Phone_Number', 'tel', false, 'Phone_Number'),
        buildInputElement('Company_Name', 'Company Name', 'text', 'Company_Name', 'organization', true, 'Company_Name'),
        div({ class: 'add-gated-form-fields' }),
        div({ class: 'add-lab-inquiry' }),
        div(
          { class: 'space-y-2 col-span-1 md:col-span-2' },
          tnc(),
          buildCheckboxElement('DHLS_Interest', 'Email', 'checkbox', 'Email_Opt_In', 'true', false),
          buildCheckboxElement('DHLS_Interest', 'Text Messages (SMS)', 'checkbox', 'SMS_Opt_In', 'true', false),
          buildCheckboxElement('DHLS_Interest', 'Phone Calls', 'checkbox', 'Phone_Opt_In', 'true', false),
          buildCheckboxElement('DHLS_Interest', 'Post', 'checkbox', 'Post_Opt_In', 'true', false),
        ),
      ),
      input(
        {
          type: 'submit',
          name: 'submit',
          value: 'Submit',
          class: 'btn btn-lg font-medium btn-primary-purple rounded-full px-6 mt-6',
          role: 'button',
        },
      ),
    ),
  );

  if (formId === 'labinquiry') {
    const additionField = div(
      { class: 'container mx-auto space-y-4' },
      buildSelectElement('Country', 'Country', 'checkbox', 'Country', 'Country', countries),
      buildInputElement('Postal_Code', 'ZIP/Postal Code', 'text', 'Postal_Code', 'postal-code', true, 'Postal_Code'),
      buildInputElement('Department', 'Department', 'text', 'Department', 'Department', false, 'Department'),
      /* Areas of Interest  */
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'Areas_of_Interest',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Areas of Interest',
        ),
        buildCheckboxElement('Areas_of_Interest', 'Analytical & Assay Reagents', 'checkbox', 'Areas_of_Interest', 'Analytical & Assay Reagents', false),
        buildCheckboxElement('Areas_of_Interest', 'Automation & Lab Workflow Solutions', 'checkbox', 'Areas_of_Interest', 'Automation & Lab Workflow Solutions', false),
        buildCheckboxElement('Areas_of_Interest', 'Cellular Analysis & Imaging', 'checkbox', 'Areas_of_Interest', 'Cellular Analysis & Imaging', false),
        buildCheckboxElement('Areas_of_Interest', 'Genomics & Gene Editing', 'checkbox', 'Areas_of_Interest', 'Genomics & Gene Editing', false),
        buildCheckboxElement('Areas_of_Interest', 'High-Throughput & Screening Systems', 'checkbox', 'Areas_of_Interest', 'High-Throughput & Screening Systems', false),
        buildCheckboxElement('Areas_of_Interest', 'Molecular & Protein Analysis', 'checkbox', 'Areas_of_Interest', 'Molecular & Protein Analysis', false),
        buildCheckboxElement('Areas_of_Interest', 'Proteins, Antibodies & Cell Culture', 'checkbox', 'Areas_of_Interest', 'Proteins, Antibodies & Cell Culture', false),
        buildCheckboxElement('Areas_of_Interest', 'Separation, Purification & Sample Processing', 'checkbox', 'Areas_of_Interest', 'Separation, Purification & Sample Processing', false),
      ),
      /* OpCo Interest  */
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'OpCoInterest',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Interested in hearing from one of our brands? Select all that apply.',
        ),
        buildCheckboxElement('OpCo_Interest', 'Abcam', 'checkbox', 'OpCo_Interest', 'Abcam', false),
        buildCheckboxElement('OpCo_Interest', 'Aldevron', 'checkbox', 'OpCo_Interest', 'Aldevron', false),
        buildCheckboxElement('OpCo_Interest', 'Beckman Coulter Life Sciences', 'checkbox', 'OpCo_Interest', 'Beckman Coulter Life Sciences', false),
        buildCheckboxElement('OpCo_Interest', 'Cytiva', 'checkbox', 'OpCo_Interest', 'Cytiva', false),
        buildCheckboxElement('OpCo_Interest', 'Genedata', 'checkbox', 'OpCo_Interest', 'Genedata', false),
        buildCheckboxElement('OpCo_Interest', 'IDBS', 'checkbox', 'OpCo_Interest', 'IDBS', false),
        buildCheckboxElement('OpCo_Interest', 'IDT', 'checkbox', 'OpCo_Interest', 'IDT', false),
        buildCheckboxElement('OpCo_Interest', 'Leica Biosystems', 'checkbox', 'OpCo_Interest', 'Leica Biosystems', false),
        buildCheckboxElement('OpCo_Interest', 'Leica Microsystems', 'checkbox', 'OpCo_Interest', 'Leica Microsystems', false),
        buildCheckboxElement('OpCo_Interest', 'Molecular Devices', 'checkbox', 'OpCo_Interest', 'Molecular Devices', false),
        buildCheckboxElement('OpCo_Interest', 'Phenomenex', 'checkbox', 'OpCo_Interest', 'Phenomenex', false),
        buildCheckboxElement('OpCo_Interest', 'SCIEX', 'checkbox', 'OpCo_Interest', 'SCIEX', false),
      ),
      buildInputElement('OpCo_Comments', 'Do you have a specific product or promotion in mind?', 'text', 'OpCo_Comments', 'primary-product-interest', false, 'OpCo_Comments'),
    );
    formEl.querySelector('.add-lab-inquiry')?.append(additionField);
  }

  if (formId === 'gatedform') {
    const gatedFormFields = div(
      { class: 'container mx-auto space-y-4' },
      buildInputElement('Postal_Code', 'ZIP/Postal Code', 'text', 'Postal_Code', 'postal-code', true, 'Postal_Code'),
      buildSelectElement('Job_Role', 'Job Role', 'checkbox', 'Job_Role', 'Job_Role', jobRole),
      buildSelectElement('Country', 'Country', 'checkbox', 'Country', 'Country', countries),
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'drugdiscovery_challenges',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Are you currently exploring solutions to improve efficiency in your workflows ?',
        ),
        buildOptionsElement('drugdiscovery_challenges', [
          { label: 'Yes, actively evaluating options within the next 3–6 months', value: 'actively_evaluating_3_6_months' },
          { label: 'Yes, but looking for longer-term solutions (6–12 months)', value: 'longer_term_6_12_months' },
          { label: 'Not right now, but potentially in the future', value: 'potentially_in_future' },
        ]),
      ),
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'OpCoInterest',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Interest in hearing from one of our experts? Select all that apply.',
        ),
        buildCheckboxElement('OpCo_Interest', 'Abcam', 'checkbox', 'OpCo_Interest', 'Abcam', false),
        buildCheckboxElement('OpCo_Interest', 'Aldevron', 'checkbox', 'OpCo_Interest', 'Aldevron', false),
        buildCheckboxElement('OpCo_Interest', 'Beckman Coulter Life Sciences', 'checkbox', 'OpCo_Interest', 'Beckman Coulter Life Sciences', false),
        buildCheckboxElement('OpCo_Interest', 'Genedata', 'checkbox', 'OpCo_Interest', 'Genedata', false),
        buildCheckboxElement('OpCo_Interest', 'IDBS', 'checkbox', 'OpCo_Interest', 'IDBS', false),
        buildCheckboxElement('OpCo_Interest', 'IDT', 'checkbox', 'OpCo_Interest', 'IDT', false),
        buildCheckboxElement('OpCo_Interest', 'Leica Microsystems', 'checkbox', 'OpCo_Interest', 'Leica Microsystems', false),
        buildCheckboxElement('OpCo_Interest', 'Molecular Devices', 'checkbox', 'OpCo_Interest', 'Molecular Devices', false),
        buildCheckboxElement('OpCo_Interest', 'Phenomenex', 'checkbox', 'OpCo_Interest', 'Phenomenex', false),
        buildCheckboxElement('OpCo_Interest', 'SCIEX', 'checkbox', 'OpCo_Interest', 'SCIEX', false),
      ),
    );
    formEl.querySelector('.add-gated-form-fields')?.append(gatedFormFields);
  }
  if (formId === 'genedataform') {
    const genedataformFields = div(
      { class: 'container mx-auto space-y-4' },
      buildSelectElement('Country', 'Country', 'checkbox', 'Country', 'Country', countries),
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'model_challenges',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Which of the following challenges have you faced when working with microphysiological systems or human-relevant models? (Select all that apply).',
        ),
        buildCheckboxElement('model_challenges', 'Limited expertise or tools for cultivation, passaging, and analysis', 'checkbox', 'model_challenges', 'limited_expertise_tools', false),
        buildCheckboxElement('model_challenges', 'Loss or degradation of organoids during handling or imaging', 'checkbox', 'model_challenges', 'organoid_loss_degradation', false),
        buildCheckboxElement('model_challenges', 'Difficulty accessing real-time data for faster decision-making', 'checkbox', 'model_challenges', 'difficulty_real_time_data', false),
        buildCheckboxElement('model_challenges', 'Reproducibility and consistency challenges', 'checkbox', 'model_challenges', 'reproducibility_consistency', false),
        buildCheckboxElement('model_challenges', 'Lack of workflow standardization and automation', 'checkbox', 'model_challenges', 'lack_standardization_automation', false),
        buildCheckboxElement('model_challenges', 'Poor data traceability and structured record-keeping', 'checkbox', 'model_challenges', 'poor_data_traceability', false),
      ),
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'drugdiscovery_challenges',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Are you currently exploring solutions to improve efficiency in your workflows ?',
        ),
        buildOptionsElement('drugdiscovery_challenges', [
          { label: 'Yes, actively evaluating options within the next 3–6 months', value: 'actively_evaluating_3_6_months' },
          { label: 'Yes, but looking for longer-term solutions (6–12 months)', value: 'longer_term_6_12_months' },
          { label: 'Not right now, but potentially in the future', value: 'potentially_in_future' },
        ]),
      ),
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'OpCoInterest',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Interest in hearing from one of our experts? Select all that apply.',
        ),
        buildCheckboxElement('OpCo_Interest', 'Abcam', 'checkbox', 'OpCo_Interest', 'Abcam', false),
        buildCheckboxElement('OpCo_Interest', 'Aldevron', 'checkbox', 'OpCo_Interest', 'Aldevron', false),
        buildCheckboxElement('OpCo_Interest', 'Beckman Coulter Life Sciences', 'checkbox', 'OpCo_Interest', 'Beckman Coulter Life Sciences', false),
        buildCheckboxElement('OpCo_Interest', 'Genedata', 'checkbox', 'OpCo_Interest', 'Genedata', false),
        buildCheckboxElement('OpCo_Interest', 'IDBS', 'checkbox', 'OpCo_Interest', 'IDBS', false),
        buildCheckboxElement('OpCo_Interest', 'IDT', 'checkbox', 'OpCo_Interest', 'IDT', false),
        buildCheckboxElement('OpCo_Interest', 'Leica Microsystems', 'checkbox', 'OpCo_Interest', 'Leica Microsystems', false),
        buildCheckboxElement('OpCo_Interest', 'Molecular Devices', 'checkbox', 'OpCo_Interest', 'Molecular Devices', false),
        buildCheckboxElement('OpCo_Interest', 'Phenomenex', 'checkbox', 'OpCo_Interest', 'Phenomenex', false),
        buildCheckboxElement('OpCo_Interest', 'SCIEX', 'checkbox', 'OpCo_Interest', 'SCIEX', false),
      ),
    );
    formEl.querySelector('.add-gated-form-fields')?.append(genedataformFields);
  }

  if (formId === 'wsawgenedataform') {
    const wsawgenedataformFields = div(
      { class: 'container mx-auto space-y-4' },
      buildSelectElement('Country', 'Country', 'checkbox', 'Country', 'Country', countries),
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'drugdiscovery_challenges',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Are you currently exploring solutions to improve efficiency in your workflows ?',
        ),
        buildOptionsElement('drugdiscovery_challenges', [
          { label: 'Yes, actively evaluating options within the next 3–6 months', value: 'actively_evaluating_3_6_months' },
          { label: 'Yes, but looking for longer-term solutions (6–12 months)', value: 'longer_term_6_12_months' },
          { label: 'Not right now, but potentially in the future', value: 'potentially_in_future' },
        ]),
      ),
      div(
        { class: 'space-y-2 col-span-1 md:col-span-2' },
        label(
          {
            for: 'OpCoInterest',
            class: 'font-normal !text-semibold !text-sm leading-4',
          },
          'Interest in hearing from one of our experts? Select all that apply.',
        ),
        buildCheckboxElement('OpCo_Interest', 'Abcam', 'checkbox', 'OpCo_Interest', 'Abcam', false),
        buildCheckboxElement('OpCo_Interest', 'Aldevron', 'checkbox', 'OpCo_Interest', 'Aldevron', false),
        buildCheckboxElement('OpCo_Interest', 'Beckman Coulter Life Sciences', 'checkbox', 'OpCo_Interest', 'Beckman Coulter Life Sciences', false),
        buildCheckboxElement('OpCo_Interest', 'Genedata', 'checkbox', 'OpCo_Interest', 'Genedata', false),
        buildCheckboxElement('OpCo_Interest', 'IDBS', 'checkbox', 'OpCo_Interest', 'IDBS', false),
        buildCheckboxElement('OpCo_Interest', 'IDT', 'checkbox', 'OpCo_Interest', 'IDT', false),
        buildCheckboxElement('OpCo_Interest', 'Leica Microsystems', 'checkbox', 'OpCo_Interest', 'Leica Microsystems', false),
        buildCheckboxElement('OpCo_Interest', 'Molecular Devices', 'checkbox', 'OpCo_Interest', 'Molecular Devices', false),
        buildCheckboxElement('OpCo_Interest', 'Phenomenex', 'checkbox', 'OpCo_Interest', 'Phenomenex', false),
        buildCheckboxElement('OpCo_Interest', 'SCIEX', 'checkbox', 'OpCo_Interest', 'SCIEX', false),
      ),
    );
    formEl.querySelector('.add-gated-form-fields')?.append(wsawgenedataformFields);
  }
  decorateIcons(formEl);
  row.innerHTML = '';
  row.append(formEl);
  loadUTMParams();

  document.querySelector('#labinquiry')?.addEventListener('submit', (event) => {
    if (formValidate()) {
      getInquiry('labinquiry');
    } else {
      event.preventDefault();
    }
  });
  document.querySelector('#gatedform')?.addEventListener('submit', (event) => {
    if (formValidate()) {
      getInquiry('gatedform');
    } else {
      event.preventDefault();
    }
  });
  document.querySelector('#genedataform')?.addEventListener('submit', (event) => {
    if (formValidate()) {
      getInquiry('genedataform');
    } else {
      event.preventDefault();
    }
  });

  document.querySelector('#wsawgenedataform')?.addEventListener('submit', (event) => {
    if (formValidate()) {
      getInquiry('wsawgenedataform');
    } else {
      event.preventDefault();
    }
  });

  document.querySelectorAll('input#Job_Role + label + ul > li').forEach((elements) => {
    elements.addEventListener('click', () => {
      const dropdownInput = document.querySelector('input[name="Job_Role"]');
      if (elements.innerText === 'Select') {
        dropdownInput.value = '';
      } else {
        dropdownInput.value = elements.innerText;
      }
      const dropdownLabel = document.querySelector('input#Job_Role + label');
      dropdownLabel.children[0].innerHTML = elements.innerText;
      dropdownLabel.click();
    });
  });

  document.querySelectorAll('input#Country + label + ul > li').forEach((el) => {
    el.addEventListener('click', () => {
      const dropdownInput = document.querySelector('input[name="Country"]');
      if (el.innerText === 'Select') {
        dropdownInput.value = '';
      } else {
        dropdownInput.value = el.innerText;
      }
      const dropdownLabel = document.querySelector('input#Country + label');
      dropdownLabel.children[0].innerHTML = el.innerText;
      dropdownLabel.click();
    });
  });
}

/** ********JOIN-TODAY-FORM Ends****************** */

// --- Utility: decode HTML entities (for cases like &lt;form ...&gt;) ---
function decodeHtmlEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

// --- Utility: Find and rebuild raw HTML forms that are split up in <p> tags, with &nbsp;, <br>, etc ---
function getRawHtmlFromParagraphs(col) {
  // Find all <p> that look like they contain raw HTML (i.e. start with <form, <div, <section, etc)
  const ps = Array.from(col.querySelectorAll('p')).filter(p => {
    const txt = p.textContent.trim();
    return txt.startsWith('<form') || txt.startsWith('<div') || txt.startsWith('<section');
  });
  if (!ps.length) return null;

  // Concatenate the HTML from all these <p>
  let html = ps.map(p => p.textContent).join('\n');
  // Remove &nbsp; and <br> if present
  html = html.replace(/&nbsp;/g, ' ').replace(/<br\s*\/?>/gi, '\n');

  // Decode entities
  html = decodeHtmlEntities(html);

  return html;
}

// --- Utility: Render raw HTML forms (works for both "all-in-p" and single <div> text node cases) ---
function renderRawHtmlForms(col) {
  // If there are paragraphs with raw HTML, rebuild and inject
  const html = getRawHtmlFromParagraphs(col);
  if (html) {
    // Remove all <p> child nodes
    Array.from(col.querySelectorAll('p')).forEach(p => p.remove());
    // Insert the decoded HTML as real HTML
    col.innerHTML = html;
    return;
  }
  // Else, fallback to previous logic (for cases with just <div> as a text node)
  col.querySelectorAll('div').forEach(div => {
    if (div.childNodes.length === 1 && div.childNodes[0].nodeType === Node.TEXT_NODE) {
      let raw = div.childNodes[0].textContent.trim();
      raw = decodeHtmlEntities(raw);
      if (raw.startsWith('<form') || raw.startsWith('<div') || raw.startsWith('<section')) {
        div.innerHTML = raw;
      }
    }
  });
}

// --- Utility: Remove all max-width, centering, etc from form wrappers and form itself ---
function fixFormColumnWidth(col) {
  const wrappers = [
    col.querySelector('.embedded-form-wrapper.form-2col-main'),
    col.querySelector('.form-2col-main'),
    col.querySelector('.embedded-form-wrapper'),
    col.querySelector('form')?.parentElement
  ].filter(Boolean);

  wrappers.forEach(wrapper => {
    [
      ...Array.from(wrapper.classList).filter(cls =>
        cls.startsWith('max-w-') ||
        cls.startsWith('w-') ||
        cls.startsWith('px-') ||
        cls.startsWith('mx-auto') ||
        cls.startsWith('my-') ||
        cls.startsWith('container')
      ),
      'mx-auto', 'my-0', 'mx-0', 'px-0', 'px-4', 'px-6', 'px-8', 'px-12', 'container'
    ].forEach(cls => wrapper.classList.remove(cls));
    wrapper.style.maxWidth = 'unset';
    wrapper.style.width = '100%';
    wrapper.style.margin = '0';
    wrapper.style.padding = '0';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.display = 'block';
    wrapper.style.justifyContent = 'unset';
    wrapper.style.alignItems = 'unset';
  });

  // Now fix the form itself
  const form = col.querySelector('form');
  if (form) {
    form.style.width = '100%';
    form.style.maxWidth = 'unset';
    form.style.margin = '0';
    form.style.padding = '0';
    form.style.boxSizing = 'border-box';
    [
      ...Array.from(form.classList).filter(cls =>
        cls.startsWith('max-w-') ||
        cls.startsWith('w-') ||
        cls.startsWith('px-') ||
        cls.startsWith('mx-auto')
      ),
      'max-w-4xl', 'max-w-2xl', 'mx-auto', 'px-4', 'px-6', 'px-8', 'px-12'
    ].forEach(cls => form.classList.remove(cls));
  }
}

// --- Utility: Align form and children inside the column ---
function alignFormInColumn(block) {
  const formWrapper =
    block.querySelector('.embedded-form-wrapper.form-2col-main') ||
    block.querySelector('.form-2col-main') ||
    block.querySelector('.embedded-form-wrapper');
  if (formWrapper) {
    [
      ...Array.from(formWrapper.classList).filter(cls =>
        cls.startsWith('max-w-') ||
        cls.startsWith('w-') ||
        cls.startsWith('px-') ||
        cls.startsWith('mx-auto') ||
        cls.startsWith('my-') ||
        cls.startsWith('container')
      ),
      'mx-auto', 'my-0', 'mx-0', 'px-0', 'px-4', 'px-6', 'px-8', 'px-12', 'container'
    ].forEach(cls => formWrapper.classList.remove(cls));
    formWrapper.style.maxWidth = 'unset';
    formWrapper.style.margin = '0';
    formWrapper.style.width = '100%';
    formWrapper.style.paddingLeft = '0';
    formWrapper.style.paddingRight = '0';
    formWrapper.style.boxSizing = 'border-box';
    formWrapper.style.display = 'block';
    formWrapper.style.justifyContent = 'unset';
    formWrapper.style.alignItems = 'unset';
  }
  const formLeft = formWrapper?.querySelector('.form-left');
  const formRight = formWrapper?.querySelector('.form-right');
  [formLeft, formRight].forEach(el => {
    if (el) {
      el.style.maxWidth = 'unset';
      el.style.minWidth = '0';
      el.style.width = '100%';
      el.style.margin = '0';
      el.style.padding = '0';
      el.style.boxSizing = 'border-box';
    }
  });
  const formEl = formWrapper?.querySelector('form');
  if (formEl) {
    formEl.style.width = '100%';
    formEl.style.boxSizing = 'border-box';
    formEl.style.maxWidth = 'unset';
    formEl.style.margin = '0';
    formEl.style.padding = '0';
    [
      ...Array.from(formEl.classList).filter(cls =>
        cls.startsWith('max-w-') ||
        cls.startsWith('w-') ||
        cls.startsWith('px-') ||
        cls.startsWith('mx-auto')
      ),
      'max-w-4xl', 'max-w-2xl', 'mx-auto', 'px-4', 'px-6', 'px-8', 'px-12'
    ].forEach(cls => formEl.classList.remove(cls));
  }
  if (formWrapper) {
    formWrapper.style.gap = '2.5rem';
    formWrapper.style.display = 'flex';
    formWrapper.style.alignItems = 'flex-start';
  }
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 800px) {
      .embedded-form-wrapper.form-2col-main {
        flex-direction: column !important;
        padding: 1.2rem 0.5rem !important;
        gap: 0.5rem !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// --- Utility: Force equal field widths/grid for form fields ---
function forceEqualFormFields(col) {
  const form =
    col.querySelector('form') ||
    col.querySelector('.form-2col-main form') ||
    col.querySelector('.embedded-form-wrapper form');
  if (!form) return;

  let fieldsWrapper = form.querySelector('.form-fields');
  let actionsWrapper = form.querySelector('.form-actions');
  if (!fieldsWrapper) {
    fieldsWrapper = document.createElement('div');
    fieldsWrapper.className = 'form-fields';
    let actions = [];
    Array.from(form.children).forEach(child => {
      if (
        child.matches?.('.form-actions, .form-action, .actions') ||
        (child.tagName === 'BUTTON' && child.type === 'submit')
      ) {
        actions.push(child);
      } else {
        fieldsWrapper.appendChild(child);
      }
    });
    form.innerHTML = '';
    form.appendChild(fieldsWrapper);
    if (actions.length) {
      actionsWrapper = document.createElement('div');
      actionsWrapper.className = 'form-actions';
      actions.forEach(btn => actionsWrapper.appendChild(btn));
      form.appendChild(actionsWrapper);
    }
  }

  fieldsWrapper.style.display = 'grid';
  fieldsWrapper.style.gridTemplateColumns = '1fr 1fr';
  fieldsWrapper.style.gap = '1.5rem 1.2rem';
  fieldsWrapper.style.width = '100%';

  const fieldSelectors = [
    'input[type="text"]',
    'input[type="email"]',
    'input[type="number"]',
    'input[type="tel"]',
    'select',
    'textarea',
    '.dropdown-label'
  ].join(',');
  fieldsWrapper.querySelectorAll(fieldSelectors).forEach(field => {
    field.style.width = '100%';
    field.style.minWidth = '0';
    field.style.boxSizing = 'border-box';
    if (field.tagName === 'TEXTAREA') {
      field.style.gridColumn = '1 / span 2';
      field.style.minHeight = '96px';
    } else {
      field.style.height = '48px';
      field.style.minHeight = '48px';
    }
    if (field.parentElement) field.parentElement.style.width = '100%';
  });

  [
    '.form-row-full',
    '.form-checkbox-row',
    '.terms',
    '.form-help',
    '.help-block'
  ].forEach(sel => {
    fieldsWrapper.querySelectorAll(sel).forEach(el => {
      el.style.gridColumn = '1 / span 2';
      el.style.width = '100%';
    });
  });

  if (!document.getElementById('form-fields-grid-style')) {
    const style = document.createElement('style');
    style.id = 'form-fields-grid-style';
    style.textContent = `
      @media (max-width: 800px) {
        .form-fields { grid-template-columns: 1fr !important; }
        .form-fields textarea { grid-column: 1 / span 1 !important; }
        .form-fields .form-row-full,
        .form-fields .form-checkbox-row,
        .form-fields .terms,
        .form-fields .form-help,
        .form-fields .help-block { grid-column: 1 / span 1 !important; }
      }
      .form-actions {
        margin-top: 2rem;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
      .form-actions button[type="submit"] {
        min-width: 200px;
      }
    `;
    document.head.appendChild(style);
  }

  // --- Fix for huge dropdown icons ---
  if (!document.getElementById('fix-dropdown-arrow-style')) {
    const style = document.createElement('style');
    style.id = 'fix-dropdown-arrow-style';
    style.textContent = `
      select {
        font-size: 16px !important;
        background-size: 1.5em auto, 100% !important;
      }
      .dropdown-label svg,
      select + svg,
      .form-fields svg,
      .form-fields .dropdown-arrow {
        width: 1.5em !important;
        height: 1.5em !important;
        max-width: 2em !important;
        max-height: 2em !important;
      }
      .form-fields select,
      .form-fields .dropdown-label,
      .form-fields .dropdown-label * {
        font-size: 16px !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export default function decorate(block) {
  block.className = '';
  block.classList.add('w-full', 'min-h-[350px]', 'columns-block');

  const container = block.querySelector('.container');
  let columns = container ? Array.from(container.children).filter(el => el.tagName === 'DIV') : [];
  if (columns.length < 2) columns = Array.from(block.children).filter(el => el.tagName === 'DIV');

  // --- Always render raw HTML forms as real DOM before any further logic ---
  columns.forEach(col => renderRawHtmlForms(col));

  // --- Robust 2 COL LOGIC: always apply to both columns, even if one is empty ---
  if (columns.length === 2) {
    [
      'w-full', 'w-1/2', 'w-1/3', 'w-2/3',
      'lg:w-full', 'lg:w-1/2', 'lg:w-1/3', 'lg:w-2/3',
      'basis-full', 'basis-1/2', 'basis-1/3', 'basis-2/3'
    ].forEach(cls => {
      columns[0].classList.remove(cls);
      columns[1].classList.remove(cls);
    });

    if (container) {
      container.className = '';
      container.classList.add('flex', 'flex-row', 'gap-8', 'w-full', 'columns-row-container');
    } else {
      block.classList.add('flex', 'flex-row', 'gap-8', 'columns-row-container');
    }

    columns.forEach(col => {
      col.classList.remove('items-center', 'items-start', 'items-end');
      col.classList.add('flex', 'flex-col', 'justify-center', 'w-full', 'h-full');
    });

    // Ratio logic
    let ratioClass = '';
    let parent = block;
    for (let i = 0; i < 2 && parent; i++) {
      if (parent.classList.contains('thirtyseventy')) { ratioClass = 'thirtyseventy'; break; }
      if (parent.classList.contains('seventythirty')) { ratioClass = 'seventythirty'; break; }
      parent = parent.parentElement;
    }
    columns[0].classList.remove('lg:w-1/2', 'lg:w-1/3', 'lg:w-2/3');
    columns[1].classList.remove('lg:w-1/2', 'lg:w-1/3', 'lg:w-2/3');
    if (ratioClass === 'thirtyseventy') {
      columns[0].classList.add('lg:w-1/3');
      columns[1].classList.add('lg:w-2/3');
    } else if (ratioClass === 'seventythirty') {
      columns[0].classList.add('lg:w-2/3');
      columns[1].classList.add('lg:w-1/3');
    } else {
      columns[0].classList.add('lg:w-1/2');
      columns[1].classList.add('lg:w-1/2');
    }

    // Image logic for both columns
    columns.forEach(col => {
      const img = col.querySelector('img');
      if (img) {
        img.removeAttribute('height'); img.removeAttribute('width');
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        if (img.parentElement) {
          img.parentElement.classList.remove(
            'columns-img-col', 'order-none', 'relative', 'h-48', 'md:h-[27rem]', 'block',
            'lg:absolute', 'md:inset-y-0', 'lg:inset-y-0', 'lg:right-2', 'lg:w-1/2', 'lg:mt-56'
          );
          img.parentElement.classList.add('columns-img-col');
        }
      }
    });
  }

  // --- 3 COL LOGIC ---
  if (columns.length === 3) {
    (container || block).className = '';
    (container || block).classList.add(
      'grid', 'gap-x-8', 'gap-y-4', 'grid-cols-1', 'lg:grid-cols-3', 'justify-items-center', 'items-center', 'w-full', 'columns-grid-container'
    );
    columns.forEach(col => {
      col.className = '';
      col.classList.add('flex', 'flex-col', 'justify-center', 'items-center', 'w-full', 'h-full');
      col.querySelectorAll('img').forEach(img => {
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.style.maxWidth = '100%';
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.objectFit = 'contain';
        img.style.display = 'block';
      });
    });
    return;
  }

  // --- FORMS ---
  columns.forEach(col => {
    if (col.querySelector('form')) {
      fixFormColumnWidth(col);
      alignFormInColumn(col);
      forceEqualFormFields(col);
    }
  });

  // --- LIST, HEADINGS, BUTTONS, ETC (unchanged, add your logic here if needed) ---
  block.querySelectorAll('div > ul, p > ul').forEach(ele => {
    ele.classList.add('text-base', 'list-disc', 'pl-10', 'space-y-2', 'text-danahergray-700');
  });
  block.querySelectorAll('h2').forEach(ele => {
    ele.classList.add('my-0', 'lg:my-4', 'font-medium', 'text-4xl2', 'inline-flex', 'leading-10');
    if (block.closest('.section')?.className.includes('text-white')) ele.classList.add('text-white');
    else ele.classList.add('text-danahergray-900');
  });
  block.querySelectorAll('.button-container > a').forEach(ele => {
    ele.classList.add(...'bg-transparent no-underline text-lg px-5 py-3 text-danaherpurple-500 border border-danaherpurple-500 leading-5 rounded-full font-medium mt-6 ease-in-out duration-150 transition-all hover:bg-danaherpurple-500 hover:text-white'.split(' '));
  });

  // --- EMBEDS ---
  block.querySelectorAll('.embed').forEach(embed => {
    let url = '';
    if (embed.dataset && embed.dataset.url) {
      url = embed.dataset.url.trim();
    } else {
      url = embed.textContent.trim();
    }
    if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match) url = `https://player.vimeo.com/video/${match[1]}`;
    }
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/v=([^&]+)/);
      if (match) url = `https://www.youtube.com/embed/${match[1]}`;
    }
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([^?&]+)/);
      if (match) url = `https://www.youtube.com/embed/${match[1]}`;
    }
    if (url.startsWith('http')) {
      if (embed.tagName.toLowerCase() === 'p') {
        const div = document.createElement('div');
        div.className = embed.className;
        embed.replaceWith(div);
        embed = div;
      }
      embed.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = "100%";
      iframe.height = "400";
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      embed.appendChild(iframe);
    }
  });
}