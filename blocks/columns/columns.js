import {
  a, div, form, input, label, span, strong,
} from '../../scripts/dom-builder.js';
import {
  decorateIcons,
} from '../../scripts/lib-franklin.js';

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

export default function decorate(block) {
  const sectionDiv = block.closest('.section');

  // Unwrap <div> inside <p>
  block.querySelectorAll('p > div').forEach((div) => {
    div.parentElement.replaceWith(div);
  });

  // block.classList.add('flex', 'items-center', 'w-full', 'min-h-[350px]', 'gap-6');

  // Universal column detection (supports wrappers)
  function getColumns(block) {
    let cols = Array.from(block.children).filter((el) => el.tagName === 'DIV');
    if (cols.length === 2 || cols.length === 3) return cols;
    if (cols.length === 1) {
      cols = Array.from(cols[0].children).filter((el) => el.tagName === 'DIV');
      if (cols.length === 2 || cols.length === 3) return cols;
    }
    return [];
  }

  const columns = getColumns(block);

  // Helper: add blog/news alignment container classes
  function addBlogNewsContainerClasses(container) {
    container.classList.add(
      'align-text-center',
      'w-full',
      'h-full',
      'container',
      'max-w-7xl',
      'mx-auto',
      'flex',
      'flex-col-reverse',
      'gap-x-12',
      'lg:flex-col-reverse',
      'justify-items-center',
    );
  }

  // --- 3 COLUMN LOGIC ---
  if (columns.length === 3) {
    block.className = '';
    columns.forEach((col) => {
      col.className = '';
      col.style.flexBasis = '';
      col.style.width = '';
      col.querySelectorAll('*').forEach((child) => {
        child.classList?.remove(
          'absolute',
          'relative',
          'lg:absolute',
          'md:inset-y-0',
          'lg:inset-y-0',
          'lg:right-2',
          'lg:mt-56',
          'order-none',
          'block',
          'h-48',
          'md:h-[27rem]',
          'lg:w-1/2',
          'columns-img-col',
          'w-1/2',
          'w-1/3',
          'w-2/3',
          'lg:w-1/3',
          'lg:w-2/3',
          'container',
          'grid',
          'flex',
          'justify-center',
          'items-center',
          'basis-full',
          'basis-1/2',
          'basis-1/3',
          'basis-2/3',
          'h-full',
        );
      });
    });

    block.classList.add(
      'w-full',
      'min-h-[350px]',
      'grid',
      'gap-x-8',
      'gap-y-4',
      'grid-cols-1',
      'lg:grid-cols-3',
      'justify-items-center',
      'items-center',
      'columns-3-cols',
    );

    columns.forEach((col) => {
      col.classList.add('flex', 'flex-col', 'justify-center', 'items-center', 'w-full', 'h-full');
      if (!col.innerHTML.trim()) col.innerHTML = '&nbsp;';
      col.querySelectorAll('img').forEach((img) => {
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.style.maxWidth = '100%';
        img.style.width = 'auto';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        // Add aspect ratio error handler
        const imageAspectRatio = 1.7778;
        img.onerror = function () {
          img.width = this.width;
          img.height = Math.floor(this.width / imageAspectRatio);
        };
      });
      // H1 padding for blog/news
      if (
        window.location.pathname.includes('/us/en/blog/')
        || window.location.pathname.includes('/us/en/news/')
      ) {
        col.querySelectorAll('h1').forEach((ele) => {
          ele.classList.add('pb-4');
        });
      }
    });

    // features-card-left logic (if present)
    if (block.className.includes('features-card-left')) {
      columns.forEach((row) => {
        const pTags = row.querySelectorAll('p');
        let cardDiv;
        let leftDiv;
        let rightDiv;
        pTags.forEach((element) => {
          if (element.firstElementChild?.nodeName?.toLowerCase() === 'span') {
            cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            leftDiv = document.createElement('div');
            leftDiv.className = 'left-content';
            rightDiv = document.createElement('div');
            rightDiv.className = 'right-content';
            leftDiv.append(element);
            cardDiv.append(leftDiv);
            cardDiv.append(rightDiv);
            row.append(cardDiv);
          } else if (rightDiv) rightDiv.append(element);
        });
      });
    }

    return;
  }

  // --- 2 COLUMN LOGIC ---
  if (columns.length === 2) {
    const firstCol = columns[0];
    const secondCol = columns[1];

    [
      'w-full', 'w-1/2', 'w-1/3', 'w-2/3',
      'lg:w-full', 'lg:w-1/2', 'lg:w-1/3', 'lg:w-2/3',
      'basis-full', 'basis-1/2', 'basis-1/3', 'basis-2/3',
    ].forEach((cls) => {
      firstCol.classList.remove(cls);
      secondCol.classList.remove(cls);
    });

    // Ratio detection
    const classes = sectionDiv.className.split(/\s+/).concat(block.className.split(/\s+/));
    if (classes.includes('thirtyseventy')) {
      firstCol.classList.add('lg:w-1/3');
      secondCol.classList.add('lg:w-2/3');
    } else if (classes.includes('seventythirty')) {
      firstCol.classList.add('lg:w-2/3');
      secondCol.classList.add('lg:w-1/3');
    } else {
      firstCol.classList.add('lg:w-1/2');
      secondCol.classList.add('lg:w-1/2');
    }

    // firstCol.classList.add('flex', 'flex-col', 'justify-center');

    // Container logic (Image 5 style takes precedence if present)
    const isPicDiv = !!firstCol.querySelector('picture');
    if (isPicDiv) {
      firstCol.classList.add('lg:w-1/2', 'picdiv');
      block.firstElementChild?.classList.add(
        'align-text-top',
        'pb-7',
        'py-0',
        'my-0',
        'container',
        'max-w-7xl',
        'mx-auto',
        'flex',
        'flex-col',
        'gap-x-12',
        'gap-y-4',
        'lg:flex-row',
        'justify-items-center',
      );
    } else {
      firstCol.classList.add('lg:w-1/2', 'flex', 'flex-col', 'justify-center');
      block.firstElementChild?.classList.add(
        'container',
        'max-w-7xl',
        'mx-auto',
        'flex',
        'flex-col',
        'gap-x-12',
        'gap-y-4',
        'lg:flex-row',
        'justify-items-center',
      );
    }

    // Responsive image style + aspect ratio error handler
    const img = secondCol.querySelector('img');
    if (img) {
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.maxWidth = '100%';
      img.style.width = 'auto';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      const imageAspectRatio = 1.7778;
      img.onerror = function () {
        img.width = this.width;
        img.height = Math.floor(this.width / imageAspectRatio);
      };
    }

    // Promotion form loading
    const aTag = secondCol.querySelectorAll('p > a');
    const formType = [...aTag].filter((ele) => ele.title === 'Form_Type');
    if (formType[0]?.title === 'Form_Type' && formType[0]?.textContent === 'promotion') {
      if (typeof loadForm === 'function') {
        loadForm(secondCol, aTag);
      }
    }

    // Blog/news column classes
    if (
      window.location.pathname.includes('/us/en/blog/')
      || window.location.pathname.includes('/us/en/news/')
    ) {
      addBlogNewsContainerClasses(block.firstElementChild);
      firstCol.classList.add('h-full', 'lg:w-1/2', 'md:pr-16');
      secondCol.classList.add('h-full', 'lg:w-1/2', 'md:pr-16');
      firstCol.querySelectorAll('h1').forEach((ele) => ele.classList.add('pb-4'));
      secondCol.querySelectorAll('h1').forEach((ele) => ele.classList.add('pb-4'));
    } else {
      block.firstElementChild?.classList.add(...'container max-w-7xl mx-auto flex flex-col gap-x-12 gap-y-4 lg:flex-row justify-items-center'.split(' '));
    }
    // picture column logic already handled below
  }

  // Add column count class for further styling if needed
  function getColumnCount(block) {
    const directDivs = Array.from(block.children).filter((el) => el.tagName === 'DIV');
    if (directDivs.length > 1) return directDivs.length;
    if (directDivs.length === 1) {
      const innerDivs = Array.from(directDivs[0].children).filter((el) => el.tagName === 'DIV');
      if (innerDivs.length > 1) return innerDivs.length;
    }
    return directDivs.length;
  }
  const colCount = getColumnCount(block);
  block.classList.add(`columns-${colCount}-cols`);

  // Style headings
  block.querySelectorAll('h2').forEach((ele) => {
    ele.classList.add(...'my-0 lg:my-4 font-medium text-4xl2 inline-flex leading-10'.split(' '));
    if (sectionDiv.className.includes('text-white')) ele.classList.add('text-white');
    else ele.classList.add('text-danahergray-900');
  });

  // Style buttons
  block.querySelectorAll('.button-container > a').forEach((ele) => {
    ele.classList.add(...'bg-transparent no-underline text-lg px-5 py-3 text-danaherpurple-500 border border-danaherpurple-500 leading-5 rounded-full font-medium mt-6 ease-in-out duration-150 transition-all hover:bg-danaherpurple-500 hover:text-white'.split(' '));
  });

  // Additional styling for bottom-border-right
  if (block.className.includes('bottom-border-right')) {
    block.querySelectorAll('div > div:nth-child(2) > p > a').forEach((ele, index, arr) => {
      if (index === arr.length - 1) ele.parentElement?.classList.add('border-0');
      else ele.parentElement?.classList.add(...'border-b border-solid border-black my-6'.split(' '));
    });
  }

  // Additional styling for bg-color-right
  if (block.className.includes('bg-color-right')) {
    const divEl = block.querySelector('div > div:nth-child(2)');
    divEl.classList.add('bg-danaherred-800', 'pb-10');
    divEl.querySelectorAll('p').forEach((ele, index, arr) => {
      if (!ele.className.includes('.button-container')) ele.classList.add(...'py-2 px-6 leading-7 text-base !text-white'.split(' '));
      ele.classList.add('href-text');
      if (index === arr.length - 1) {
        ele.querySelector('a')?.classList.add(...'btn-outline-trending-brand text-lg font-medium rounded-full px-6 py-3 !no-underline'.split(' '));
      }
    });
    divEl.querySelectorAll('h2, h3, h4').forEach((ele) => {
      ele.classList.add(...'py-2 px-6 !text-white'.split(' '));
    });
  }

  // Style lists and icons
  block.querySelectorAll('div > ul, p > ul').forEach((ele) => {
    ele.classList.add(...'text-base list-disc pl-10 space-y-2 text-danahergray-700'.split(' '));
  });

  block.querySelectorAll('p > span.icon').forEach((element) => {
    element.classList.add(...'w-12 h-12 relative rounded-md bg-danaherblue-900 text-white shrink-0'.split(' '));
    const svg = element.querySelector('svg');
    if (svg) svg.classList.add(...'w-4 h-4 rounded shadow invert brightness-0'.split(' '));
  });

  // Add column container classes for certain layouts
  if (block.className.includes('columns-3-cols')) {
    block.firstElementChild?.classList.add(...'container max-w-7xl mx-auto grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-3 justify-items-center items-center'.split(' '));
    block.querySelector('h4')?.classList.add('font-bold');
  }

  // Style links
  block.querySelectorAll('p > a[title="link"]').forEach((item) => {
    item.parentElement.classList.add('link', 'pb-8');
    item.textContent += ' ->';
    item.classList.add(...'text-sm font-bold'.split(' '));
    if (sectionDiv.className.includes('text-white')) item.classList.add('text-white');
    else item.classList.add('text-danaherpurple-500');
  });

  // Style images for special layouts
  block.querySelectorAll('picture').forEach((pic) => {
    const picWrapper = pic.closest('div');
    if (picWrapper && picWrapper.children.length === 1) {
      if (
        window.location.pathname.includes('/us/en/blog/')
        || window.location.pathname.includes('/us/en/news/')
      ) {
        picWrapper.classList.add(...'columns-img-col order-none relative h-48 md:h-[27rem] block lg:absolute md:inset-y-0 lg:inset-y-0 lg:right-2 lg:w-1/2 lg:mt-56'.split(' '));
        pic.querySelector('img').classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
      } else {
        picWrapper.classList.add('columns-img-col', 'order-none');
        const seventythirtyEl = picWrapper.parentElement
          ?.parentElement?.parentElement?.parentElement;
        if (seventythirtyEl?.querySelector('img')) {
          pic.querySelector('img').classList.add('block', 'w-1/2');
        } else {
          pic.querySelector('img').classList.add('block');
        }
      }
    }
  });
}
