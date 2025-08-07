export default async function decorate(block) {
  // Step 1: Find the container holding the embedded form script string
  const scriptContainer = block.querySelector('.script');
  if (!scriptContainer) {
    console.warn('No script container found in block');
    return;
  }

  // Step 2: Get the embedded form HTML/script string
  let embeddedHtml = scriptContainer.textContent || scriptContainer.innerText;

  // Optional: decode HTML entities if your HTML is escaped in the JSON
  const txt = document.createElement('textarea');
  txt.innerHTML = embeddedHtml;
  embeddedHtml = txt.value;

  // Step 3: Inject the raw HTML into a dedicated container inside block
  block.innerHTML = `<div class="embedded-form-container">${embeddedHtml}</div>`;

  // Step 4: Run any embedded <script> tags inside the container
  const container = block.querySelector('.embedded-form-container');
  const scripts = container.querySelectorAll('script');
  scripts.forEach((script) => {
    try {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
        newScript.async = false; // To preserve order if needed
      } else {
        newScript.textContent = script.textContent;
      }
      document.head.appendChild(newScript);
      document.head.removeChild(newScript);
    } catch (e) {
      console.error('Script execution error:', e);
    }
  });
}
