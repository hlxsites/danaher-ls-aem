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
  window.dataLayer?.push({ event: 'formSubmit', formId: 'TTAE', inquiry: inquiry });
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

async function loadSFDCForm(block) {
  const formIdEl = block?.firstElementChild;
  const formId = formIdEl?.firstElementChild?.textContent || 'TTAE';
  const formNameEl = formIdEl?.nextElementSibling;
  const formName = block?.firstElementChild?.nextElementSibling?.textContent || 'TTAE';
  const clientIdEl = formNameEl?.nextElementSibling;
  const clientId = formNameEl?.nextElementSibling?.textContent || '546006278';
  const deExternalKeyEl = clientIdEl?.nextElementSibling;
  const deExternalKey = deExternalKeyEl?.textContent || 'TTAE';
  const actionEl = deExternalKeyEl?.nextElementSibling;
  const action = actionEl?.textContent || 'add';
  const inquiryTypeEl = actionEl?.nextElementSibling;
  const inquiryType = inquiryTypeEl?.textContent || 'Talk to an Expert';
  const successUrlEl = inquiryTypeEl?.nextElementSibling;
  const successUrl = successUrlEl?.textContent || 'https://stage.lifesciences.danaher.com/us/en/solutions/mabs/cell-line-development.html';
  const errorUrlEl = successUrlEl?.nextElementSibling;
  const errorUrl = errorUrlEl?.textContent || 'https://help.salesforce.com/s/articleView?id=sf.mc\_es\_demanager.htm';
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
        buildInputElement('Postal_Code', 'ZIP / Postal code', 'text', 'Postal_Code', 'postal-code', true, 'Postal_Code'),
        buildSelectElement('Job_Role', 'Job role', 'checkbox', 'Job_Role', 'Job_Role', roles),
        buildSelectElement('Country', 'Country', 'checkbox', 'Country', 'Country', countries),
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
          // emailOptIn(),
          tnc(),
          buildCheckboxElement('DHLS_Interest', 'Email', 'checkbox', 'Email_Opt_In', 'true', false),
          buildCheckboxElement('DHLS_Interest', 'SMS', 'checkbox', 'SMS_Opt_In', 'true', false),
          buildCheckboxElement('DHLS_Interest', 'Phone', 'checkbox', 'Phone_Opt_In', 'true', false),
          buildCheckboxElement('DHLS_Interest', 'Direct Mail', 'checkbox', 'Post_Opt_In', 'true', false),
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

  // document.querySelector('#TTAE').addEventListener('submit', (event) => {
  //   if (formValidate()) {
  //     getInquiry();
  //   } else {
  //     event.preventDefault();
  //   }
  // });

  const formElement = document.querySelector(`#${formId}`);
  if (formElement) {
    formElement.addEventListener('submit', (event) => {
      if (formValidate()) {
        getInquiry();
      } else {
        event.preventDefault();
      }
    });
  } else {
    console.warn(`Form with id ${formId} not found!`);
  }

  document.querySelectorAll('input#Job_Role + label + ul > li').forEach((el) => {
    el.addEventListener('click', () => {
      const dropdownInput = document.querySelector('input[name="Job_Role"]');
      if (el.innerText === 'Select') {
        dropdownInput.value = '';
      } else {
        dropdownInput.value = el.innerText;
      }
      console.log('dropdownInput', dropdownInput);
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
  loadSFDCForm(block);
}
