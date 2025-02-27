import {
  a, div, form, input, label, span, strong, textarea,
} from '../../scripts/dom-builder.js';
import {
  decorateIcons,
} from '../../scripts/lib-franklin.js';

const roles = ['Select', 'C-Suite', 'Vice President', 'Associate Vice President', 'Executive Director', 'Director',
  'Department Head / Group Lead', 'Principal Scientist', 'Operations Manager', 'Lab Manager', 'Scientist', 'Senior Scientist',
  'Associate Scientist', 'Graduate Student', 'Academia'];

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
  const list = document.createElement('ul');
  list.classList.add(...'absolute w-full max-h-48 overflow-scroll hidden peer-checked:block z-10 bg-white py-2 text-sm text-gray-700 rounded-lg shadow'.split(' '));
  itemsList.forEach((item) => {
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

function emailOptIn() {
  const emailOptin = div(
    { class: 'flex items-baseline' },
    input(
      {
        type: 'checkbox',
        name: 'Email_Opt_In',
        class: 'input-focus-checkbox',
        value: 'true',
        'data-required': false,
        'aria-label': 'Email_Opt_In',
      },
    ),
    label(
      {
        for: 'DHLS_Interest',
        class: 'pl-2',
      },
      'I would like to receive more information via email about products and services offered by DH Life Sciences, LLC.',
    ),
  );
  return emailOptin;
}

function tnc() {
  const tncEl = div(
    { class: 'flex items-center mt-5' },
    span(
      {
        style: 'font-family: helvetica, arial, sans-serif; font-size: 13px;',
      },
      'By submitting this form, you agree to the ',
      span(
        {
          style: 'color: #000000;',
        },
        'By clicking the Submit button below and proceeding I confirm that I have reviewed and agree with the',
      ),
      strong(
        a({
          'aria-label': 'Link Terms of Use',
          title: 'https://lifesciences.danaher.com/us/en/legal/terms-of-use.html',
          href: 'https://lifesciences.danaher.com/us/en/legal/terms-of-use.html',
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'fui-Link ___m14voj0 f3rmtva f1ern45e f1deefiw f1n71otn f1q5o8ev f1h8hb77 f1vxd6vx f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1hu3pq6 f11qmguv f19f4twv f1tyq0we f1g0x7ka fhxju0i f1qch9an f1cnd47f fqv5qza f1vmzxwi f1o700av f13mvf36 f9n3di6 f1ids18y fygtlnl f1deo86v f12x56k7 f1iescvh ftqa4ok f50u1b5 fs3pq8b f1hghxdh f1tymzes f1x7u7e9 f1cmlufx f10aw75t fsle3fq',
          tabindex: '-1',
        }, 'Terms of Use'),
      ),
      span({ style: 'color: #000000;' }, ' and the '),
      strong(
        a(
          {
            'aria-label': 'Link Privacy Policy',
            title: 'https://lifesciences.danaher.com/us/en/legal/privacy-policy.html',
            href: 'https://lifesciences.danaher.com/us/en/legal/privacy-policy.html',
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'fui-Link ___m14voj0 f3rmtva f1ern45e f1deefiw f1n71otn f1q5o8ev f1h8hb77 f1vxd6vx f1ewtqcl fyind8e f1k6fduh f1w7gpdv fk6fouc fjoy568 figsok6 f1hu3pq6 f11qmguv f19f4twv f1tyq0we f1g0x7ka fhxju0i f1qch9an f1cnd47f fqv5qza f1vmzxwi f1o700av f13mvf36 f9n3di6 f1ids18y fygtlnl f1deo86v f12x56k7 f1iescvh ftqa4ok f50u1b5 fs3pq8b f1hghxdh f1tymzes f1x7u7e9 f1cmlufx f10aw75t fsle3fq',
            tabindex: '-1',
          },
          'Privacy Policy',
        ),
      ),
    ),
  );
  return tncEl;
}

function getInquiry() {
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
  window.dataLayer?.push({ event: 'formSubmit', formId: 'labinquiry', inquiry: inquiry });
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
  document.getElementsByName('UTM_Campaign')[0].value = localStorage.getItem('danaher_utm_campaign');
  document.getElementsByName('UTM_Medium')[0].value = localStorage.getItem('danaher_utm_medium');
  document.getElementsByName('UTM_Term')[0].value = localStorage.getItem('danaher_utm_term');
  document.getElementsByName('UTM_Source')[0].value = localStorage.getItem('danaher_utm_source');
  document.getElementsByName('UTM_NLC')[0].value = localStorage.getItem('danaher_utm_nlc');
  document.getElementsByName('Page_Track_URL')[0].value = localStorage.getItem('danaher_utm_previouspage');
}

async function loadSFDCjointodayForm(block) {
  const formIdEl = block?.firstElementChild;
  const formId = formIdEl?.firstElementChild?.nextElementSibling?.textContent;
  const formNameEl = formIdEl?.nextElementSibling;
  const formName = formNameEl?.firstElementChild?.nextElementSibling?.textContent;
  const clientIdEl = formNameEl?.nextElementSibling;
  const clientId = clientIdEl?.firstElementChild?.nextElementSibling?.textContent;
  const deExternalKeyEl = clientIdEl?.nextElementSibling;
  const deExternalKey = deExternalKeyEl?.firstElementChild?.nextElementSibling?.textContent;
  const actionEl = deExternalKeyEl?.nextElementSibling;
  const action = actionEl?.firstElementChild?.nextElementSibling?.textContent;
  const inquiryTypeEl = actionEl?.nextElementSibling?.nextElementSibling;
  const inquiryType = inquiryTypeEl?.firstElementChild?.nextElementSibling?.textContent;
  const successUrlEl = inquiryTypeEl?.nextElementSibling;
  const successUrl = successUrlEl?.firstElementChild?.nextElementSibling?.textContent;
  const errorUrlEl = successUrlEl?.nextElementSibling;
  const errorUrl = errorUrlEl?.firstElementChild?.nextElementSibling?.textContent;
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
      input({ type: 'hidden', name: '_returnXML', value: '1' }),
      input({ type: 'hidden', name: 'Inquiry_Type', value: `${inquiryType}` }),
      input({ type: 'hidden', name: 'Inquiry_Number' }),
      input({ type: 'hidden', name: 'UTM_Content' }),
      input({ type: 'hidden', name: 'UTM_Campaign' }),
      input({ type: 'hidden', name: 'UTM_Medium' }),
      input({ type: 'hidden', name: 'UTM_Term' }),
      input({ type: 'hidden', name: 'UTM_Source' }),
      input({ type: 'hidden', name: 'UTM_NLC' }),
      input({ type: 'hidden', name: 'Page_Track_URL' }),
      input({ type: 'hidden', name: 'Job_Role', 'data-required': true }),
      input({ type: 'hidden', name: 'Country', 'data-required': true }),
      input({ type: 'hidden', name: '_successURL', value: `${successUrl}` }),
      input({ type: 'hidden', name: '_errorURL', value: `${errorUrl}` }),
      div(
        { class: 'container mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6' },
        buildInputElement('First_Name', 'First name', 'text', 'First_Name', 'given-name', true, 'First_Name'),
        buildInputElement('Last_Name', 'Last name', 'text', 'Last_Name', 'family-name', true, 'Last_Name'),
        buildInputElement('Email_Address', 'Email address', 'text', 'Email_Address', 'email', true, 'Email_Address'),
        buildInputElement('Phone_Number', 'Phone number', 'text', 'Phone_Number', 'tel', false, 'Phone_Number'),
        buildInputElement('Company_Name', 'Company name', 'text', 'Company_Name', 'organization', true, 'Company_Name'),
        buildInputElement('Address1', 'Address1', 'text', 'Address_Line_1', 'Address1', true, 'Address_Line_1'),
        buildInputElement('Address2', 'Address1', 'text', 'Address_Line_2', 'Address2', false, 'Address_Line_1'),
        buildInputElement('City', 'City', 'text', 'City', 'City', true, 'City'),
        buildInputElement('State', 'City', 'text', 'State', 'State', true, 'State'),
        buildInputElement('Postal_Code', 'ZIP / Postal code', 'text', 'Postal_Code', 'postal-code', true, 'Postal_Code'),
        buildSelectElement('Job_Role', 'Job role', 'checkbox', 'Job_Role', 'Job_Role', roles),
        buildSelectElement('Country', 'Country', 'checkbox', 'Country', 'Country', countries),
        buildSelectElement('Department', 'Department', 'text', 'Department', 'Department', 'Department'),
        div(
          { class: 'space-y-2 col-span-1 md:col-span-2' },
          label(
            {
              for: 'OpCo_Comments',
              class: 'font-normal text-sm leading-4',
            },
            'Additional information (please provide as many details as possible):',
          ),
          textarea(
            {
              name: 'OpCo_Comments',
              autocomplete: 'off',
              'data-required': false,
              rows: '3',
              cols: '50',
              class: 'input-focus text-base w-full block px-2 py-4 font-extralight border border-solid border-gray-300',
              'aria-label': 'OpCo_Comments',
            },
          ),
          emailOptIn(),
          tnc(),
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
  block.innerHTML = '';
  decorateIcons(formEl);
  block.append(formEl);
  loadUTMParams();

  document.querySelector('#labinquiry').addEventListener('submit', (event) => {
    if (formValidate()) {
      getInquiry();
    } else {
      event.preventDefault();
    }
  });

  document.querySelectorAll('input#Job_Role + label + ul > li').forEach((el) => {
    el.addEventListener('click', () => {
      const dropdownInput = document.querySelector('input[name="Job_Role"]');
      if (el.innerText === 'Select') {
        dropdownInput.value = '';
      } else {
        dropdownInput.value = el.innerText;
      }
      const dropdownLabel = document.querySelector('input#Job_Role + label');
      dropdownLabel.children[0].innerHTML = el.innerText;
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

export default function decorate(block) {
  block.classList.add('relative');
  loadSFDCjointodayForm(block);
}
