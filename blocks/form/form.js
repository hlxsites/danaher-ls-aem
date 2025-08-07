export default async function decorate(block) {
  const raw = block.textContent || block.innerText;
  if (!raw) {
    console.warn('No embedded script found in block');
    return;
  }

  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = raw;
  const decodedHtml = textarea.value;

  // Parse decoded HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(decodedHtml, 'text/html');

  // Extract component styles and remove them from doc
  const componentStyles = doc.querySelectorAll('component[\\:is="\'style\'"]');
  let capturedStyles = '';
  componentStyles.forEach(component => {
    capturedStyles += component.textContent + '\n';
    component.remove();
  });

  // Extract <style> tags inside decoded HTML
  const inlineStyles = [...doc.querySelectorAll('style')];
  inlineStyles.forEach(style => {
    capturedStyles += style.textContent + '\n';
    style.remove();
  });

  // Extract component scripts and remove them
  const componentScripts = doc.querySelectorAll('component[async][\\:is="\'script\'"]');
  let combinedScript = '';
  componentScripts.forEach(component => {
    combinedScript += component.textContent + '\n';
    component.remove();
  });

  // Inject decoded HTML (without styles/scripts) into block
  block.innerHTML = doc.body.innerHTML;

  // Add wrapper class for scoping
  block.classList.add('embedded-form-wrapper');

  // Helper function: scope CSS selectors by prefixing with .embedded-form-wrapper
  function scopeCss(cssText, scopeSelector) {
    // Simple prefixer: add scopeSelector before each selector block
    // This is a naive implementation, for complex CSS consider a CSS parser
    return cssText.replace(/(^|})(\s*[^{}]+){/g, (match, g1, selectors) => {
      // For multiple selectors separated by comma, prefix each
      const scopedSelectors = selectors.split(',')
        .map(s => `${scopeSelector} ${s.trim()}`)
        .join(', ');
      return `${g1} ${scopedSelectors} {`;
    });
  }

  // Scope captured styles
  const scopedStyles = scopeCss(capturedStyles, '.embedded-form-wrapper');

  // Your custom fallback styles (optional, you can keep or remove)
  const customStyles = `
.embedded-form-wrapper {
  text-align: left !important;
  box-sizing: border-box !important;
}
.embedded-form-wrapper *, 
.embedded-form-wrapper *::before, 
.embedded-form-wrapper *::after {
  box-sizing: inherit !important;
  text-align: left !important;
  justify-content: flex-start !important;
  align-items: flex-start !important;
}
...
`; // (Insert your full customStyles here as before)

  // Inject scoped styles + your custom styles into a style tag
  const styleTag = document.createElement('style');
  styleTag.appendChild(document.createTextNode(scopedStyles + '\n' + customStyles));
  document.head.appendChild(styleTag);

  // Handle any <script> tags inside content
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

  // Run extracted component scripts
  if (combinedScript.trim()) {
    const scriptTag = document.createElement('script');
    scriptTag.textContent = combinedScript;
    document.body.appendChild(scriptTag);
  }

  // Debug: warn if no form elements found
  if (!block.querySelector('select, input, textarea, button')) {
    console.warn('No form elements found inside the block after decoration');
  }
}
