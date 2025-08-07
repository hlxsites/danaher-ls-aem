export default async function decorate(block) {
  // Step 1: Find the container holding the embedded form script string
  // Assuming your model renders the field inside an element with class 'script'
  const scriptContainer = block.querySelector('.script');
  if (!scriptContainer) {
    console.warn('No script container found in block');
    return;
  }

  // Step 2: Get the embedded form HTML/script string
  const embeddedHtml = scriptContainer.textContent || scriptContainer.innerText;

  // Step 3: Inject the raw HTML into the block to render the form
  block.innerHTML = embeddedHtml;

  // Step 4: Run any embedded <script> tags inside the block (inline JS)
  const scripts = block.querySelectorAll('script');
  scripts.forEach((script) => {
    try {
      const newScript = document.createElement('script');
      if (script.src) {
        // For external scripts, copy the src
        newScript.src = script.src;
      } else {
        // For inline scripts, copy the content and run
        newScript.textContent = script.textContent;
      }
      document.head.appendChild(newScript);
      document.head.removeChild(newScript);
    } catch (e) {
      console.error('Script execution error:', e);
    }
  });
}
