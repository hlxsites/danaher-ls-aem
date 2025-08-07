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

  // Serialize cleaned HTML back
  decodedHtml = doc.body.innerHTML;

  // Inject cleaned HTML after styles are in place
  block.innerHTML = decodedHtml;

  // Execute normal <script> tags in injected HTML
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

  // Execute extracted <component> script code
  if (combinedScript.trim()) {
    const scriptTag = document.createElement('script');
    scriptTag.textContent = combinedScript;
    document.body.appendChild(scriptTag);
  }

  // Move any leftover <style> tags from block to head (if needed)
  const styles = block.querySelectorAll('style');
  styles.forEach(style => {
    if (!document.head.contains(style)) {
      document.head.appendChild(style.cloneNode(true));
    }
  });

  // ✅ Inject additional CSS for form alignment and styling
  if (!document.getElementById('custom-dropdown-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'custom-dropdown-styles';
   styleEl.textContent = `
  /* Base improvements */
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

  /* ✅ TEXT ALIGN LEFT ENFORCEMENT */
  .form-section,
  .form-wrapper,
  .form-block,
  .form-container,
  form,
  form * {
    text-align: left !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
  }

  /* Fix for checkbox + label */
  .checkbox-wrapper,
  .checkbox-row,
  .checkbox-container,
  .checkbox-label,
  input[type="checkbox"] + label,
  label[for] {
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    text-align: left !important;
    gap: 8px;
    line-height: 1.5;
    margin: 0.5rem 0;
  }

  /* Legal text / paragraph alignment */
  .form-disclaimer,
  .form-note,
  .form-legal,
  .legal-text,
  .disclaimer {
    text-align: left !important;
    font-size: 14px;
    line-height: 1.6;
    margin-top: 1rem;
    color: #333;
  }

  /* Optional: space between fields */
  .form-section,
  .form-group {
    margin-bottom: 1.25rem;
  }
`;
   /* Checkbox label alignment fix */
   
    document.head.appendChild(styleEl);
  }
}
