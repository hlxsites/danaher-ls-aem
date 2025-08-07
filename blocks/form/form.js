export default async function decorate(block) {
  // Step 1: Decode all component content inside the block
  const components = block.querySelectorAll('component');

  components.forEach((component) => {
    const type = component.getAttribute('is');

    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = component.innerHTML;
    const decoded = textarea.value;

    if (type === 'script') {
      const script = document.createElement('script');
      script.textContent = decoded;
      document.body.appendChild(script); // Append to body to execute
      component.remove(); // Clean up
    }

    if (type === 'style') {
      const style = document.createElement('style');
      style.textContent = decoded;
      document.head.appendChild(style);
      component.remove(); // Clean up
    }
  });

  // Step 2: Decode and inject any remaining escaped HTML (like form HTML)
  const textarea = document.createElement('textarea');
  textarea.innerHTML = block.innerHTML;
  block.innerHTML = textarea.value;
}
