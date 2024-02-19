import { loadScript } from '../../scripts/lib-franklin.js';

// eslint-disable no-console
export default async function decorate(block) {
  const tmpFormName = block.firstElementChild;
  const formName = tmpFormName.firstElementChild.nextElementSibling.innerHTML;
  const tmpThankYou = block.firstElementChild.nextElementSibling;
  const thankYou = tmpThankYou.firstElementChild.nextElementSibling.innerHTML;
  const formId = formName.split('_')[1];

  const formEl = `<div style="margin-top:0rem; margin-bottom:4rem;margin-left:0rem;margin-right:1rem;">
            <form id=${formName} class="relative"></form>
            <section>
              <div class="form-container mb-8">
                  <div class="relative z-10">
                      <div class="mktoForm">
                          <form id=${thankYou}></form>
                          <div class="max-w-7xl mx-auto flex flex-col items-center justify-center h-80 bg-white" style="display:none" id="thankyou">
                              <p class="font-bold text-3xl text-gray-700" style="margin-bottom:1rem;">Thank you, your submission has been submitted.</p>
                              <p class="font-normal text-lg text-gray-700">We will get in touch with you shortly.</p>
                              <p class="font-normal text-lg text-gray-700">While you wait please check out our latest <a href="blog.html" class="underline text-gray-700">insights</a> and <a href="news.html" class="underline text-gray-700">innovations</a></p>
                          </div>
                      </div>
                  </div>
              </div>
            </section>
          </div>`;

  block.innerHTML = formEl;

  await loadScript('//306-EHG-641.mktoweb.com/js/forms2/js/forms2.min.js');

  window.MktoForms2.loadForm('//306-EHG-641.mktoweb.com', '306-EHG-641', `${formId}`, (form) => {
    window.dataLayer?.push({ event: 'formLoad', formId: `${formId}` });
    const formElement = form.getFormElem();
    let start = false;
    formElement[0].addEventListener('change', () => {
      if (!start) {
        window.dataLayer?.push({ event: 'formStart', formId: `${formId}` });
        start = true;
      }
    });

    form.onValidate(() => {
      form.vals({
        uTMCampaign: localStorage.getItem('danaher_utm_campaign'),
        uTMContent: localStorage.getItem('danaher_utm_content'),
        uTMMedium: localStorage.getItem('danaher_utm_medium'),
        uTMSource: localStorage.getItem('danaher_utm_source'),
      });
    });

    form.onSubmit(() => {
      const currentDate = new Date();
      const year = currentDate.getUTCFullYear();
      const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getUTCDate()).padStart(2, '0');
      const hour = String(currentDate.getUTCHours()).padStart(2, '0');
      const min = String(currentDate.getUTCMinutes()).padStart(2, '0');
      const sec = String(currentDate.getUTCSeconds()).padStart(2, '0');
      const milli = String(currentDate.getUTCMilliseconds()).padStart(3, '0');
      const inquiry = year + month + day + hour + min + sec + milli;
      form.vals({ inquiryDatetimestamp: inquiry });
      window.dataLayer?.push({ event: 'formSubmit', formId: `${formId}`, inquiry });
    });

    form.onSuccess(() => {
      form.getFormElem().hide();
      document.getElementById('thankyou').style.display = 'flex';
      return false;
    });
  });

  window.MktoForms2.whenRendered((form) => {
    function getgacid() {
      try {
        const tracker = window.ga.getAll()[0];
        return tracker.get('clientId');
      } catch (e) {
        return 'n/a';
      }
    }
    form.vals({
      gacid: getgacid(),
    });
  });
}
