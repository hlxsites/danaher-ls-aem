export default async function decorate(block) {
  // Step 1: Retrieve the raw script string from the embedded model
  const scriptString = block.textContent || block.innerText;

  // Step 2: Parse the script string as HTML and inject into the block
  const container = document.createElement('div');
  container.innerHTML = scriptString;
  block.innerHTML = ''; // Clear block first
  block.append(...container.childNodes); // Append parsed HTML to block

  // Step 3: Execute <component async is="script"> tags
  const scripts = block.querySelectorAll('component[async][is="script"]');
  scripts.forEach((script) => {
    try {
      new Function(script.textContent)();
    } catch (e) {
      console.error('Script execution error:', e);
    }
  });

  // Step 4: Inject <component is="style"> into <head>
  const styles = block.querySelectorAll('component[is="style"]');
  styles.forEach((styleComponent) => {
    const styleEl = document.createElement('style');
    styleEl.textContent = styleComponent.textContent;
    document.head.appendChild(styleEl);
  });
}
