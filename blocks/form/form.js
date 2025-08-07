export default async function decorate(block) {
  // Step 1: Extract raw HTML string (escaped) from block
  let rawHtml = block.textContent || block.innerText;
  if (!rawHtml) {
    console.warn('No content found in block');
    return;
  }

  // Step 2: Decode HTML entities (convert escaped HTML string to real HTML)
  const textarea = document.createElement('textarea');
  textarea.innerHTML = rawHtml;
  const decodedHtml = textarea.value;

  // Step 3: Inject decoded HTML into the block
  block.innerHTML = decodedHtml;

  // Step 4: Extract and run <script> tags inside the injected HTML
  const scripts = Array.from(block.querySelectorAll('script'));
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script');
    // Copy src attribute if external script
    if (oldScript.src) {
      newScript.src = oldScript.src;
      newScript.async = false; // preserve execution order if multiple scripts
    } else {
      // Inline script content
      newScript.textContent = oldScript.textContent;
    }
    // Replace old script with new one to trigger execution
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });

  // Step 5: (Optional) Handle embedded <style> tags if any
  const styles = block.querySelectorAll('style');
  styles.forEach((style) => {
    // If styles need to be moved to <head> for scope reasons
    document.head.appendChild(style);
  });
}
