export default async function decorate(block) {
  // Step 1: Get escaped HTML content from the block (richtext input)
  const raw = block.textContent || block.innerText;
  if (!raw) {
    console.warn('No embedded script found in block');
    return;
  }

  // Step 2: Decode HTML entities (in case content is escaped)
  const textarea = document.createElement('textarea');
  textarea.innerHTML = raw;
  const decodedHtml = textarea.value;

  // Step 3: Inject decoded HTML into the block
  block.innerHTML = decodedHtml;

  // Step 4: Move any <style> tags inside block to document head (avoid duplicates)
  const styles = block.querySelectorAll('style');
  styles.forEach(style => {
    const exists = [...document.head.querySelectorAll('style')].some(
      s => s.textContent === style.textContent
    );
    if (!exists) {
      document.head.appendChild(style.cloneNode(true));
    }
    // Remove original style after cloning to avoid duplicates inside block
    style.remove();
  });

  // Step 5: Inject required dropdown styles if not already present
  if (!document.getElementById('custom-dropdown-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'custom-dropdown-styles';
    styleEl.textContent = `
      .prior {
        position: absolute;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
      }
      .prior:checked ~ .prior-checked\\:block {
        display: block !important;
      }
      .max-h-48 {
        max-height: 12rem;
      }
      .overflow-scroll {
        overflow-y: auto;
      }
      .input-focus:focus {
        border: 1px solid #7523FF !important;
        outline: none;
      }
      .input-focus-checkbox {
        margin-top: 14px;
        margin-bottom: 14px;
        width: 16px;
        height: 16px;
        border: 1px;
        radius: 4px;
        accent-color: #7523FF;
      }
      .prior:checked ~ .prior-checked\\:block {
        display: block;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Step 6: Execute all <script> tags inside the block
  const scripts = block.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
      newScript.async = false;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });

  // Step 7: Run your custom form/dropdown script logic
  // This replaces the <component async :is="'script'"> custom code from your original markup

  // Dropdown selection for Job_Role
  document.querySelectorAll('input#Job_Role + label + ul > li').forEach(el => {
    el.addEventListener('click', () => {
      const dropdownInput = document.querySelector('input[name="Job_Role"]');
      if (!dropdownInput) return;
      dropdownInput.value = el.innerText === 'Select' ? '' : el.innerText;
      const dropdownLabel = document.querySelector('input#Job_Role + label');
      if (!dropdownLabel) return;
      dropdownLabel.children[0].innerHTML = el.innerText;
      dropdownLabel.click(); // to toggle checkbox
    });
  });

  // Dropdown selection for Country (repeat if exists)
  document.querySelectorAll('input#Country + label + ul > li').forEach(el => {
    el.addEventListener('click', () => {
      const dropdownInput = document.querySelector('input[name="Country"]');
      if (!dropdownInput) return;
      dropdownInput.value = el.innerText === 'Select' ? '' : el.innerText;
      const dropdownLabel = document.querySelector('input#Country + label');
      if (!dropdownLabel) return;
      dropdownLabel.children[0].innerHTML = el.innerText;
      dropdownLabel.click();
    });
  });

  // Validation function
  function fm_valid() {
    let isValid = true;
    document.querySelectorAll('[data-required]').forEach(el => {
      if (el.dataset.required === 'true') {
        const msgEl = document.querySelector(`[data-name="${el.name}"]`);
        if (!el.value.length) {
          if (msgEl) msgEl.innerHTML = 'This field is required';
          isValid = false;
        } else if (msgEl) {
          msgEl.innerHTML = '';
        }
      }
    });
    return isValid;
  }

  // On window load: populate hidden UTM fields from localStorage
  window.onload = () => {
    ['Content', 'Campaign', 'Medium', 'Term', 'Source', 'NLC', 'Previouspage'].forEach(key => {
      const field = document.getElementsByName(`UTM_${key}`)[0];
      if (field) {
        field.value = localStorage.getItem(`danaher_utm_${key.toLowerCase()}`) || '';
      }
    });
    const pageTrackField = document.getElementsByName('Page_Track_URL')[0];
    if (pageTrackField) {
      pageTrackField.value = localStorage.getItem('danaher_utm_previouspage') || '';
    }
  };

  // Form submit listener
  const form = document.querySelector('#TTAE');
  if (form) {
    form.addEventListener('submit', event => {
      if (fm_valid()) {
        getInquiry();
      } else {
        event.preventDefault();
      }
    });
  }

  // Generate Inquiry Number and push to dataLayer
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
    const inquiryInput = document.getElementsByName('Inquiry_Number')[0];
    if (inquiryInput) inquiryInput.value = inquiry;
    window.dataLayer?.push({ event: 'formSubmit', formId: 'TTAE', inquiry });
  }
}
