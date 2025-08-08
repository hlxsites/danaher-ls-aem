export default async function decorate(block) {
  // Safely get the raw HTML source
  const raw = block.textContent || block.innerText;
  if (!raw) {
    console.warn('No embedded script found in block');
    return;
  }

  // Remove Markdown/code block fences if present
  let cleanedRaw = raw.replace(/^```(?:html)?|```$/gm, "").trim();

  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = cleanedRaw;
  let decodedHtml = textarea.value;

  // Replace &nbsp; and invisible chars
  decodedHtml = decodedHtml.replace(/(&nbsp;|\u00a0)+/gi, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Replace ":is" with "is"
  const normalizedHtml = decodedHtml.replace(/:is=/g, 'is=');

  // Parse decoded HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(normalizedHtml, 'text/html');

  // Extract styles/scripts
  let capturedStyles = '';
  doc.querySelectorAll('component[is="style"], style').forEach(style => {
    capturedStyles += style.textContent + '\n';
    style.remove();
  });
  let combinedScript = '';
  doc.querySelectorAll('component[async][is="script"]').forEach(component => {
    combinedScript += component.textContent + '\n';
    component.remove();
  });
  doc.querySelectorAll('component').forEach(el => el.remove());

  // Find the main <div> and inject
  const mainDiv = doc.querySelector('div');
  block.innerHTML = mainDiv ? mainDiv.outerHTML : doc.body.innerHTML;
  block.classList.add('embedded-form-wrapper', 'form-2col-main');

  // Responsive two-column grid CSS and field styling, with spacing and chevron icon fix
  const customStyles = `
/* --- 2col form layout --- */
.form-2col-main {
  display: flex;
  align-items: flex-start;
  gap: 2.5rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1rem 2rem 1rem;
  box-sizing: border-box;
  font-family: 'Inter', Arial, sans-serif;
}
.form-2col-main .form-left {
  min-width: 240px;
  max-width: 320px;
  flex: 0 0 310px;
  margin-right: 2rem;
}
.form-2col-main .form-left h2,
.form-2col-main .form-left .form-title {
  font-size: 1.375rem;
  font-weight: 500;
  line-height: 1.35;
  margin: 0 0 2.2rem 0;
}
.form-2col-main .form-right {
  flex: 1 1 0%;
  min-width: 0;
}
.form-2col-main form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.1rem 1.3rem;
  width: 100%;
}
@media (max-width: 800px) {
  .form-2col-main {
    flex-direction: column;
    padding: 1.2rem 0.5rem;
    gap: 0.5rem;
  }
  .form-2col-main .form-left {
    max-width: unset;
    margin: 0 0 1.5rem 0;
  }
  .form-2col-main form {
    grid-template-columns: 1fr;
    gap: 1.3rem 0;
  }
}
.form-2col-main label {
  display: block;
  font-weight: 400;
  font-size: 0.97rem;
  margin-bottom: 0.35em;
  color: #111;
  letter-spacing: 0.01em;
}
.form-2col-main input[type="text"],
.form-2col-main input[type="email"],
.form-2col-main input[type="number"],
.form-2col-main input[type="tel"],
.form-2col-main textarea,
.form-2col-main ul[id="dropdown"],
.form-2col-main .dropdown-label {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1.15em;
  padding: 0.68em 1em;
  border: 1.5px solid #bdbdbd;
  border-radius: 5px;
  font-size: 1.02rem;
  background: #fff;
  color: #111;
  outline: none;
  transition: border 0.2s;
}
.form-2col-main input[type="text"]:focus,
.form-2col-main input[type="email"]:focus,
.form-2col-main input[type="number"]:focus,
.form-2col-main input[type="tel"]:focus,
.form-2col-main textarea:focus {
  border: 1.5px solid #6c47f5;
}
.form-2col-main ul[id="dropdown"] {
  margin: 0;
  z-index: 100;
  min-width: 100%;
  background: #fff;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.09);
  border: 1.5px solid #bdbdbd;
  border-top: none;
  list-style: none;
  padding: 0;
  position: absolute;
  left: 0;
  top: 100%;
  max-height: 170px;
  overflow-y: auto;
}
.form-2col-main ul[id="dropdown"] li {
  padding: 0.7em 1em;
  cursor: pointer;
  font-size: 1.01rem;
  border-bottom: 1px solid #efefef;
}
.form-2col-main ul[id="dropdown"] li:last-child {
  border-bottom: none;
}
.form-2col-main ul[id="dropdown"] li:hover,
.form-2col-main ul[id="dropdown"] li:focus {
  background: #f6f2ff;
}
.form-2col-main .dropdown-label {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: #fff;
  cursor: pointer;
  transition: border 0.2s;
  border: 1.5px solid #bdbdbd;
  border-radius: 5px;
  font-size: 1.02rem;
  padding-right: 2.3em;
}
.form-2col-main .dropdown-label svg.chevron {
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  width: 1.35em;
  height: 1.35em;
  fill: none;
  stroke: #7c40ff;
  stroke-width: 2;
  pointer-events: none;
  display: block;
}
.form-2col-main input[type="checkbox"].prior { display: none; }
.form-2col-main textarea {
  min-height: 88px;
  resize: vertical;
  grid-column: 1 / span 2;
  margin-bottom: 1.15em;
}
.form-2col-main .form-row.jobrole,
.form-2col-main .form-row.country {
  margin-bottom: 0;
}
.form-2col-main .form-row-full {
  grid-column: 1 / span 2;
}
.form-2col-main .form-checkbox-row {
  display: flex;
  align-items: baseline;
  grid-column: 1 / span 2;
  margin: 0.25em 0 0.7em 0;
}
.form-2col-main input[type="checkbox"]:not(.prior) {
  margin-right: 0.6em;
  vertical-align: middle;
}
.form-2col-main button,
.form-2col-main input[type="submit"] {
  display: block;
  width: 150px;
  margin: 1.9em 0 0.7em 0;
  padding: 0.82em 0;
  background: #6c47f5;
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 1.18em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  grid-column: 1 / span 1;
}
.form-2col-main button:hover,
.form-2col-main input[type="submit"]:hover {
  background: #4f2cb8;
}
.form-2col-main .terms,
.form-2col-main .form-help,
.form-2col-main .help-block {
  color: #666;
  font-size: 0.95em;
  grid-column: 1 / span 2;
  margin: 0.4em 0;
}
.form-2col-main .terms strong,
.form-2col-main .terms a {
  font-weight: 500;
  color: #2d1d7a;
  text-decoration: underline;
}
.form-2col-main .text-red-500 {
  color: #e53935;
  margin-left: 0.2em;
  font-size: 0.93em;
}
.form-2col-main svg {
  display: inline-block;
  vertical-align: middle;
  max-width: 24px;
  max-height: 24px;
}
.form-2col-main .required-message {
  color: #e53935;
  font-size: 0.93em;
  margin-top: 0.12em;
  margin-bottom: 0.35em;
  display: none;
}
`;

  // Scope extracted styles and add to <head>
  function scopeCss(cssText, scopeSelector) {
    return cssText.replace(/(^|})(\s*[^{}]+){/g, (match, g1, selectors) => {
      const scopedSelectors = selectors.split(',')
        .map(s => `${scopeSelector} ${s.trim()}`)
        .join(', ');
      return `${g1} ${scopedSelectors} {`;
    });
  }
  const styleTag = document.createElement('style');
  styleTag.appendChild(document.createTextNode(scopeCss(capturedStyles, '.embedded-form-wrapper') + '\n' + customStyles));
  document.head.appendChild(styleTag);

  // Re-inject any <script> tags to execute them
  block.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.src) newScript.src = oldScript.src;
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });

  // Run combined <component async is="script">
  if (combinedScript.trim()) {
    const scriptTag = document.createElement('script');
    scriptTag.textContent = combinedScript;
    document.body.appendChild(scriptTag);
  }

  // --- Robust custom dropdown logic for your structure ---
  function setupCustomDropdowns(scope) {
    scope.querySelectorAll('input.prior[type="checkbox"]').forEach(input => {
      const container = input.closest('div');
      if (!container) return;

      // Replace dropdown label icon with chevron if not already present
      const label = container.querySelector(`label[for="${input.id}"]`);
      if (label) {
        // Remove any existing SVG
        label.querySelectorAll('svg').forEach(svg => svg.remove());
        // Add chevron SVG
        const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chevron.setAttribute('width', '20');
        chevron.setAttribute('height', '20');
        chevron.setAttribute('viewBox', '0 0 20 20');
        chevron.setAttribute('fill', 'none');
        chevron.setAttribute('aria-hidden', 'true');
        chevron.classList.add('chevron');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M6 8l4 4 4-4');
        path.setAttribute('stroke', '#7c40ff');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        chevron.appendChild(path);
        label.appendChild(chevron);
      }

      const ul = container.querySelector('ul#dropdown');
      const span = label ? (label.querySelector('span') || label) : null;
      const hiddenInput = scope.querySelector(`input[type="hidden"][name="${input.id}"]`);

      if (!label || !ul || !span) return;

      label.addEventListener('click', function(e) {
        e.preventDefault();
        scope.querySelectorAll('input.prior').forEach(i => {
          if (i !== input) {
            i.checked = false;
            const otherUl = i.closest('div')?.querySelector('ul#dropdown');
            if (otherUl) otherUl.classList.add('hidden');
          }
        });
        input.checked = !input.checked;
        ul.classList.toggle('hidden', !input.checked);
      });

      ul.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function(e) {
          e.preventDefault();
          const text = li.textContent.trim();
          if (hiddenInput) hiddenInput.value = text === 'Select' ? '' : text;
          span.textContent = text;
          input.checked = false;
          ul.classList.add('hidden');
        });
      });

      label.setAttribute('tabindex', '0');
      label.addEventListener('keydown', function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          label.click();
        }
      });
    });

    if (!window.__dropdownListenerAdded) {
      document.addEventListener('click', function(e) {
        document.querySelectorAll('.embedded-form-wrapper').forEach(scope => {
          scope.querySelectorAll('input.prior').forEach(i => {
            const container = i.closest('div');
            const ul = container?.querySelector('ul#dropdown');
            const label = container?.querySelector(`label[for="${i.id}"]`);
            if (ul && !ul.contains(e.target) && (!label || !label.contains(e.target))) {
              i.checked = false;
              ul.classList.add('hidden');
            }
          });
        });
      });
      window.__dropdownListenerAdded = true;
    }
  }

  setupCustomDropdowns(block);

  // --- Validation logic for required fields (per asterisk) ---
  // Find the form element
  const form = block.querySelector('form');
  if (form) {
    // Mark fields with asterisk as required and add validation messages
    form.querySelectorAll('label').forEach(label => {
      const asterisk = label.querySelector('.text-red-500, .required, [style*="color:red"], [style*="color: #e53935"]');
      if (asterisk && !label.classList.contains('no-required')) {
        // Try to find associated input/select/textarea
        let field;
        // For input/textarea/select with matching id
        const forAttr = label.getAttribute('for');
        if (forAttr) {
          field = form.querySelector(`#${forAttr}`);
        }
        // For dropdown custom fields
        if (!field) {
          // Try input/textarea/select inside parent row
          field = label.parentNode.querySelector('input, textarea, select');
        }
        // For custom dropdown: look for hidden input with name == id
        if (field && field.type === 'checkbox' && field.classList.contains('prior')) {
          const hiddenInput = form.querySelector(`input[type="hidden"][name="${field.id}"]`);
          if (hiddenInput) field = hiddenInput;
        }

        // Add required attribute if possible
        if (field && !field.hasAttribute('required')) {
          field.setAttribute('required', 'required');
          field.setAttribute('aria-required', 'true');
        }

        // Add error message after field
        if (field && !field.requiredMessageAdded) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'required-message';
          errorMsg.innerText = 'This field is required';
          field.insertAdjacentElement('afterend', errorMsg);
          field.requiredMessageAdded = true;
        }
      }
    });

    // Validation on submit
    form.addEventListener('submit', function(e) {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        // For dropdown: check hidden input value
        let value = field.value ? field.value.trim() : '';
        // For checkboxes (not custom dropdowns), check checked state
        if (field.type === 'checkbox' && !field.classList.contains('prior')) {
          value = field.checked ? 'on' : '';
        }
        const errorMsg = field.nextElementSibling && field.nextElementSibling.classList.contains('required-message')
          ? field.nextElementSibling
          : null;
        if (!value) {
          valid = false;
          if (errorMsg) errorMsg.style.display = 'block';
          field.classList.add('invalid');
        } else {
          if (errorMsg) errorMsg.style.display = 'none';
          field.classList.remove('invalid');
        }
      });
      if (!valid) {
        e.preventDefault();
        // Optionally, scroll to first error
        const firstError = form.querySelector('.invalid');
        if (firstError && typeof firstError.scrollIntoView === 'function') {
          firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
      }
    });

    // Hide error on input/change
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        const errorMsg = field.nextElementSibling && field.nextElementSibling.classList.contains('required-message')
          ? field.nextElementSibling
          : null;
        if (field.value && errorMsg) {
          errorMsg.style.display = 'none';
          field.classList.remove('invalid');
        }
      });
      field.addEventListener('change', () => {
        const errorMsg = field.nextElementSibling && field.nextElementSibling.classList.contains('required-message')
          ? field.nextElementSibling
          : null;
        if (field.value && errorMsg) {
          errorMsg.style.display = 'none';
          field.classList.remove('invalid');
        }
      });
    });
  }

  if (!block.querySelector('select, input, textarea, button')) {
    console.warn('No form elements found inside the block after decoration');
  }
}