function decodeHtmlEntities(text) {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}

export default async function decorate(block) {
  // Inject the form HTML first as before
  const rawHtml = block.textContent || block.innerText || '';
  block.innerHTML = rawHtml;

  // Run embedded <component async is="script"> tags
  const scripts = block.querySelectorAll('component[async][is="script"]');
  scripts.forEach((script) => {
    try {
      // Decode HTML entities before executing script text
      const decodedScript = decodeHtmlEntities(script.innerText);
      new Function(decodedScript)();
    } catch (e) {
      console.error('Script execution error:', e);
    }
  });

  // Inject styles
  const styles = block.querySelectorAll('component[is="style"]');
  styles.forEach((styleComponent) => {
    const styleEl = document.createElement('style');
    styleEl.innerText = styleComponent.innerText;
    document.head.appendChild(styleEl);
  });
}
