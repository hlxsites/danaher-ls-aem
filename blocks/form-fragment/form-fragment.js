export default async function decorate(block) {
  // Step 1: Get escaped HTML from fragment field (text inside the block)
  const raw = block.textContent || block.innerText;
  if (!raw) {
    console.warn('No embedded script found in block');
    return;
  }

  // Step 2: Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = raw;
  const decodedHtml = textarea.value;

  // Step 3: Inject decoded HTML into the block
  block.innerHTML = decodedHtml;

  // Step 4: Execute <script> tags
  const scripts = block.querySelectorAll('script');
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
      newScript.async = false;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });

  // Step 5: Move any <style> tags to <head> for proper scoping
  const styles = block.querySelectorAll('style');
  styles.forEach((style) => {
    document.head.appendChild(style.cloneNode(true));
  });
}
