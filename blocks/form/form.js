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

  // --- Add your custom scoped styles here ---
  const customStyles = `
.embedded-form-wrapper {
  text-align: left;
}
.embedded-form-wrapper * {
  text-align: left !important;
  justify-content: flex-start !important;
  align-items: flex-start !important;
}

/* Custom dropdown fix and form styles */
.embedded-form-wrapper .form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  width: 100%;
}
.embedded-form-wrapper label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: normal;
  text-align: left;
  width: 100%;
}
.embedded-form-wrapper .select-wrapper {
  position: relative;
  width: 100%;
}
.embedded-form-wrapper .select-wrapper select {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  appearance: none;
  background-color: white;
  cursor: pointer;
  box-sizing: border-box;
  overflow: visible;
}
.embedded-form-wrapper .select-wrapper::after {
  content: "";
  position: absolute;
  pointer-events: none;
  top: 50%;
  right: 0.75rem;
  width: 0;
  height: 0;
  margin-top: -3px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #333;
}
.embedded-form-wrapper .select-wrapper select:focus {
  border-color: #7523FF;
  outline: none;
}
.embedded-form-wrapper input[type="text"],
.embedded-form-wrapper textarea {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.embedded-form-wrapper textarea {
  min-height: 80px;
  resize: vertical;
}
.embedded-form-wrapper input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #7523FF;
  margin: 0;
}
.embedded-form-wrapper button[type="submit"],
.embedded-form-wrapper input[type="submit"] {
  background-color: #d56618;
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  width: 150px;
  text-align: center;
  transition: background-color 0.3s ease;
}
.embedded-form-wrapper button[type="submit"]:hover,
.embedded-form-wrapper input[type="submit"]:hover {
  background-color: #b25214;
}
`;

  capturedStyles += customStyles;

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
    styleTag.textContent = capturedStyles;
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
