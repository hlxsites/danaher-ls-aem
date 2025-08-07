export default async function decorate(block) {
  // ✅ Step 1: Skip rewriting block HTML from textContent (avoids rendering issues)
  // If you're dynamically injecting HTML, do it from a trusted source, not textContent
  // Commented out due to breaking structured form layout:
  // const rawHtml = block.textContent || block.innerText;
  // block.innerHTML = rawHtml;

  // ✅ Step 2: Run embedded <component async is="script"> tags safely
  const scripts = block.querySelectorAll('component[async][is="script"]');
  scripts.forEach((script) => {
    try {
      // Executes the JavaScript code within the component
      new Function(script.textContent)();
    } catch (e) {
      console.error('Script execution error:', e);
    }
  });

  // ✅ Step 3: Inject styles from <component is="style"> into <head>
  const styles = block.querySelectorAll('component[is="style"]');
  styles.forEach((styleComponent) => {
    const styleEl = document.createElement('style');
    styleEl.textContent = styleComponent.textContent;
    document.head.appendChild(styleEl);
  });

  // ✅ Optional: Apply enhancement logic to form fields (e.g., styling, accessibility, etc.)
  // Example: Autofocus the first input field
  const firstInput = block.querySelector('input, select, textarea');
  if (firstInput) firstInput.focus();
}
