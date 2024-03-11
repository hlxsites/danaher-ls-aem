import {
  a, div, form, p, section,
} from '../../scripts/dom-builder.js';
import { loadScript } from '../../scripts/lib-franklin.js';

// eslint-disable no-console
async function loadMarketo(block) {
  const tmpFormName = block?.firstElementChild;
  const formName = tmpFormName?.firstElementChild?.nextElementSibling?.innerHTML;
  const tmpThankYou = tmpFormName?.nextElementSibling;
  const thankYou = tmpThankYou?.firstElementChild?.nextElementSibling?.innerHTML;
  const formId = formName.split('_')[1];

  const p1El = block?.querySelector('h2');
  const p2El = block?.querySelector('strong');
  const p3El = block?.lastElementChild?.querySelector('div');
  let linkText = '';
  if (p3El?.textContent.includes('insights') && p3El?.textContent.includes('innovations')) {
    linkText = p(
      { class: 'font-normal text-lg text-gray-700' },
      'While you wait, check out our latest ',
      a({
        href: '/us/en/blog.html',
        class: 'relative z-0 underline decoration-[#7523FF] decoration-[3px] hover:text-white hover:bg-[#7523FF] break-all md:break-normal transition ease-in-out duration-700',
      }, 'insights'),
      ' and ',
      a({
        href: '/us/en/news.html',
        class: 'relative z-0 underline decoration-[#7523FF] decoration-[3px] hover:text-white hover:bg-[#7523FF] break-all md:break-normal transition ease-in-out duration-700',
      }, 'innovations'),
    );
  } else {
    linkText = p3El?.textContent;
  }

  const formEl = div(
    { class: 'mt-0 mb-16 ml-0 mr-4' },
    form({ id: `${formName}`, class: 'relative' }),
    section(
      div(
        { class: 'form-container mb-8' },
        div(
          { class: 'relative z-10' },
          div(
            { class: 'mktoForm' },
            form({ id: `${thankYou}` }),
            div(
              { class: 'max-w-7xl mx-auto flex flex-col items-center justify-center h-80 bg-white', style: 'display:none', id: 'thankyou' },
              p({ class: 'font-bold text-3xl text-gray-700 mb-4' }, `${p1El?.textContent}`),
              p({ class: 'font-normal text-lg text-gray-700' }, `${p2El?.textContent}`),
              linkText,
            ),
          ),
        ),
      ),
    ),
  );

  block.innerHTML = '';
  block.append(formEl);

  await loadScript('//306-EHG-641.mktoweb.com/js/forms2/js/forms2.min.js');

  window.MktoForms2.loadForm('//306-EHG-641.mktoweb.com', '306-EHG-641', `${formId}`, (mktoform) => {
    window.dataLayer?.push({ event: 'formLoad', formId: `${formId}` });
    const formElement = mktoform.getFormElem();
    let start = false;
    formElement[0].addEventListener('change', () => {
      if (!start) {
        window.dataLayer?.push({ event: 'formStart', formId: `${formId}` });
        start = true;
      }
    });

    mktoform.onValidate(() => {
      mktoform.vals({
        uTMCampaign: localStorage.getItem('danaher_utm_campaign'),
        uTMContent: localStorage.getItem('danaher_utm_content'),
        uTMMedium: localStorage.getItem('danaher_utm_medium'),
        uTMSource: localStorage.getItem('danaher_utm_source'),
      });
    });

    mktoform.onSubmit(() => {
      const currentDate = new Date();
      const year = currentDate.getUTCFullYear();
      const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getUTCDate()).padStart(2, '0');
      const hour = String(currentDate.getUTCHours()).padStart(2, '0');
      const min = String(currentDate.getUTCMinutes()).padStart(2, '0');
      const sec = String(currentDate.getUTCSeconds()).padStart(2, '0');
      const milli = String(currentDate.getUTCMilliseconds()).padStart(3, '0');
      const inquiry = year + month + day + hour + min + sec + milli;
      mktoform.vals({ inquiryDatetimestamp: inquiry });
      window.dataLayer?.push({ event: 'formSubmit', formId: `${formId}`, inquiry });
    });

    mktoform.onSuccess(() => {
      mktoform.getFormElem().hide();
      document.getElementById('thankyou').style.display = 'flex';
      return false;
    });
  });

  window.MktoForms2.whenRendered((mktoform) => {
    function getgacid() {
      try {
        const tracker = window.ga.getAll()[0];
        return tracker.get('clientId');
      } catch (e) {
        return 'n/a';
      }
    }
    mktoform.vals({
      gacid: getgacid(),
    });
  });
}

export default function decorate(block) {
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadMarketo(block);
    }
  });
  observer.observe(block);
}
