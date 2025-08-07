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

  // --- Extract inline component styles ---
  const componentStyles = doc.querySelectorAll('component[\\:is="\'style\'"]');
  let capturedStyles = '';
  componentStyles.forEach(component => {
    capturedStyles += component.textContent + '\n';
    component.remove();
  });

  // --- Extract component scripts ---
  const componentScripts = doc.querySelectorAll('component[async][\\:is="\'script\'"]');
  let combinedScript = '';
  componentScripts.forEach(component => {
    combinedScript += component.textContent + '\n';
    component.remove();
  });

  // --- Inject decoded HTML into the block ---
  block.innerHTML = doc.body.innerHTML;

  // --- Wrap content in a unique class for style scoping ---
  block.classList.add('embedded-form-wrapper');

  // --- Inject captured styles (scoped or global) ---
  if (capturedStyles.trim()) {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
/* Scoped styles for form */
.embedded-form-wrapper {
  text-align: left;
}
.embedded-form-wrapper * {
  text-align: left !important;
  justify-content: flex-start !important;
  align-items: flex-start !important;
}
/* Original captured styles */
${capturedStyles}
`;
    document.head.appendChild(styleTag);
  }

  // --- Handle <script> tags inside the content ---
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

  // --- Run extracted <component :is="script"> scripts ---
  if (combinedScript.trim()) {
    const scriptTag = document.createElement('script');
    scriptTag.textContent = combinedScript;
    document.body.appendChild(scriptTag);
  }

  // --- Move any remaining <style> inside block to head ---
  const styles = block.querySelectorAll('style');
  styles.forEach(style => {
    if (!document.head.contains(style)) {
      document.head.appendChild(style.cloneNode(true));
    }
  });
}
