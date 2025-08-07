export default async function decorate(block) {
  // Step 1: Extract raw HTML from block
  const rawHtml = block.textContent || block.innerText;

  // Step 2: Inject the HTML into the block (includes form, scripts, styles)
  block.innerHTML = rawHtml;

  // Step 3: Run embedded <component async is="script"> tags
  const scripts = block.querySelectorAll('component[async][is="script"]');
  scripts.forEach((script) => {
    try {
      new Function(script.innerText)(); // Safer than eval
    } catch (e) {
      console.error('Script execution error:', e);
    }
  });

  // Step 4: Inject styles from <component is="style">
  const styles = block.querySelectorAll('component[is="style"]');
  styles.forEach((styleComponent) => {
    const styleEl = document.createElement('style');
    styleEl.innerText = styleComponent.innerText;
    document.head.appendChild(styleEl);
  });
}
