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

  // Fix: Replace ":is" with "is" for easier querying
  const normalizedHtml = decodedHtml.replace(/:is=/g, 'is=');

  // Parse decoded HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(normalizedHtml, 'text/html');

  // Extract <component is="style"> tags
  const componentStyles = doc.querySelectorAll('component[is="style"]');
  let capturedStyles = '';
  componentStyles.forEach(component => {
    capturedStyles += component.textContent + '\n';
    component.remove();
  });

  // Extract <style> tags
  doc.querySelectorAll('style').forEach(style => {
    capturedStyles += style.textContent + '\n';
    style.remove();
  });

  // Extract <component async is="script">
  const componentScripts = doc.querySelectorAll('component[async][is="script"]');
  let combinedScript = '';
  componentScripts.forEach(component => {
    combinedScript += component.textContent + '\n';
    component.remove();
  });

  // Inject HTML (without styles/scripts)
  block.innerHTML = doc.body.innerHTML;
  block.classList.add('embedded-form-wrapper');

  // CSS scoping (naive, as before)
  function scopeCss(cssText, scopeSelector) {
    return cssText.replace(/(^|})(\s*[^{}]+){/g, (match, g1, selectors) => {
      const scopedSelectors = selectors.split(',')
        .map(s => `${scopeSelector} ${s.trim()}`)
        .join(', ');
      return `${g1} ${scopedSelectors} {`;
    });
  }

  // Scope styles and add custom styles
  const customStyles = `
.embedded-form-wrapper {
  text-align: left !important;
  box-sizing: border-box !important;
}
/* ... your other custom styles ... */
`;

  const styleTag = document.createElement('style');
  styleTag.appendChild(document.createTextNode(scopeCss(capturedStyles, '.embedded-form-wrapper') + '\n' + customStyles));
  document.head.appendChild(styleTag);

  // Re-run <script> tags in HTML
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

  // Debug: warn if no form elements found
  if (!block.querySelector('select, input, textarea, button')) {
    console.warn('No form elements found inside the block after decoration');
  }
}