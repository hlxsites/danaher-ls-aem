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
  /* Force left alignment with specificity */
  .form-container,
  .form-container > *,
  .form-wrapper, form .form-note, form .legal-text {
    text-align: left !important;
  }

  /* Convert inline labels to block or inline-flex */
  label, .checkbox-label, .form-label {
    display: inline-flex !important;
    align-items: center !important;
    text-align: left !important;
  }

  /* Checkbox + label alignment */
  .checkbox-container, .checkbox-wrapper {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 8px !important;
  }

  /* If labels are anchors or inline, make them block-level */
  a.form-link, label > a {
    display: block !important;
    text-align: left !important;
  }
`;

   /* Checkbox label alignment fix */
   
    document.head.appendChild(styleEl);
  }
}
