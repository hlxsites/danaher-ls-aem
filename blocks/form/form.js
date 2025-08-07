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

  // Extract inline component styles
  const componentStyles = doc.querySelectorAll('component[\\:is="\'style\'"]');
  let capturedStyles = '';
  componentStyles.forEach(component => {
    capturedStyles += component.textContent + '\n';
    component.remove();
  });

  // Extract component scripts
  const componentScripts = doc.querySelectorAll('component[async][\\:is="\'script\'"]');
  let combinedScript = '';
  componentScripts.forEach(component => {
    combinedScript += component.textContent + '\n';
    component.remove();
  });

  // Inject decoded HTML into the block
  block.innerHTML = doc.body.innerHTML;

  // Add wrapper class for scoping
  block.classList.add('embedded-form-wrapper');

  // Custom styles scoped inside embedded-form-wrapper
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

.embedded-form-wrapper .form-group {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  margin-bottom: 1.5rem !important;
  width: 100% !important;
}
.embedded-form-wrapper label {
  font-weight: 600 !important;
  margin-bottom: 0.25rem !important;
  white-space: normal !important;
  text-align: left !important;
  width: 100% !important;
}
.embedded-form-wrapper .select-wrapper {
  position: relative !important;
  width: 100% !important;
}
.embedded-form-wrapper .select-wrapper select {
  width: 100% !important;
  padding: 0.5rem 2rem 0.5rem 0.5rem !important;
  font-size: 1rem !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
  appearance: none !important;
  background-color: white !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
  overflow: visible !important;
}
.embedded-form-wrapper .select-wrapper::after {
  content: "" !important;
  position: absolute !important;
  pointer-events: none !important;
  top: 50% !important;
  right: 0.75rem !important;
  width: 0 !important;
  height: 0 !important;
  margin-top: -3px !important;
  border-left: 6px solid transparent !important;
  border-right: 6px solid transparent !important;
  border-top: 6px solid #333 !important;
  z-index: 2 !important;
}
.embedded-form-wrapper .select-wrapper select:focus {
  border-color: #7523FF !important;
  outline: none !important;
}
.embedded-form-wrapper input[type="text"],
.embedded-form-wrapper textarea {
  width: 100% !important;
  padding: 0.5rem !important;
  font-size: 1rem !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
  box-sizing: border-box !important;
}
.embedded-form-wrapper textarea {
  min-height: 80px !important;
  resize: vertical !important;
}
.embedded-form-wrapper input[type="checkbox"] {
  width: 16px !important;
  height: 16px !important;
  accent-color: #7523FF !important;
  margin: 0 !important;
}
.embedded-form-wrapper button[type="submit"],
.embedded-form-wrapper input[type="submit"] {
  background-color: #d56618 !important;
  color: #fff !important;
  border: none !important;
  border-radius: 3px !important;
  padding: 0.6rem 1rem !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  margin-top: 1rem !important;
  width: 150px !important;
  text-align: center !important;
  transition: background-color 0.3s ease !important;
}
.embedded-form-wrapper button[type="submit"]:hover,
.embedded-form-wrapper input[type="submit"]:hover {
  background-color: #b25214 !important;
}
`;

  // Append custom styles to captured styles
  capturedStyles += customStyles;

  // Inject captured styles after block content is present
  if (capturedStyles.trim()) {
    const styleTag = document.createElement('style');
    styleTag.appendChild(document.createTextNode(capturedStyles));
    document.head.appendChild(styleTag);
  }

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

  // Move any remaining <style> inside block to head
  const styles = block.querySelectorAll('style');
  styles.forEach(style => {
    if (!document.head.contains(style)) {
      document.head.appendChild(style.cloneNode(true));
    }
  });

  // Debug: log if form elements exist inside the block
  if (!block.querySelector('select, input, textarea, button')) {
    console.warn('No form elements found inside the block after decoration');
  }
}
