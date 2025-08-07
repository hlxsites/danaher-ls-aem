export default async function decorate(block) {
  const raw = block.textContent || block.innerText;
  if (!raw) {
    console.warn('No embedded script found in block');
    return;
  }

  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = raw;
  let decodedHtml = textarea.value;

  // Parse decoded HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(decodedHtml, 'text/html');

  // --- Extract and inject <component :is="'style'"> styles first ---
  const componentStyles = doc.querySelectorAll('component[\\:is="\'style\'"]');
  componentStyles.forEach(component => {
    const styleTag = document.createElement('style');
    styleTag.textContent = component.textContent;
    document.head.appendChild(styleTag);
    component.remove();
  });

  // --- Handle <component async :is="'script'"> ---
  const componentScripts = doc.querySelectorAll('component[async][\\:is="\'script\'"]');
  let combinedScript = '';
  componentScripts.forEach(component => {
    combinedScript += component.textContent + '\n';
    component.remove();
  });

  // ✅ Inject extra CSS BEFORE HTML is inserted (so browser renders with styles already in)
  if (!document.getElementById('custom-form-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'custom-form-styles';
    styleEl.textContent = `
      /* Left-align all text in form */
      form, .form-wrapper, .form-block, .form-section, .form-container, .form-wrapper * {
        text-align: left !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
      }

      /* Label + checkbox alignment */
      input[type="checkbox"] + label,
      .checkbox-wrapper,
      .checkbox-row,
      .checkbox-label {
        display: flex !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        gap: 8px;
        line-height: 1.5;
        text-align: left !important;
        margin: 0.5rem 0;
      }

      /* Paragraphs, disclaimers */
      .form-disclaimer,
      .form-note,
      .form-legal,
      .legal-text,
      .disclaimer,
      p {
        text-align: left !important;
        margin-top: 1rem;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
      }

      /* Dropdown/input enhancements */
      .prior {
        position: absolute;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
      }

      .prior:checked ~ .prior-checked\\:block {
        display: block !important;
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

      .max-h-48 {
        max-height: 12rem;
      }

      .overflow-scroll {
        overflow-y: auto;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // --- Now insert HTML into block ---
  block.innerHTML = doc.body.innerHTML;

  // --- Execute inline scripts ---
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

  // --- Execute extracted <component> script ---
  if (combinedScript.trim()) {
    const scriptTag = document.createElement('script');
    scriptTag.textContent = combinedScript;
    document.body.appendChild(scriptTag);
  }

  // --- Move any <style> from block into head ---
  const styles = block.querySelectorAll('style');
  styles.forEach(style => {
    if (!document.head.contains(style)) {
      document.head.appendChild(style.cloneNode(true));
    }
  });
}
