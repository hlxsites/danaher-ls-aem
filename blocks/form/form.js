export default async function decorate(block) {
  // ✅ DO NOT overwrite block.innerHTML with raw text!
  // The form markup should already exist in the block.

  // ✅ Step 1: Run embedded <component async is="script"> tags safely
  const scripts = block.querySelectorAll('component[async][is="script"]');
  scripts.forEach((script) => {
    try {
      new Function(script.textContent)(); // safer than eval
    } catch (e) {
      console.error('Script execution error:', e);
    }
  });

  // ✅ Step 2: Inject styles from <component is="style">
  const styles = block.querySelectorAll('component[is="style"]');
  styles.forEach((styleComponent) => {
    const styleEl = document.createElement('style');
    styleEl.textContent = styleComponent.textContent;
    document.head.appendChild(styleEl);
  });

  // ✅ Step 3: Optionally focus the first input to improve UX
  const firstInput = block.querySelector('input, select, textarea');
  if (firstInput) firstInput.focus();
}
