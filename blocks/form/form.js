export default async function decorate(block) {
  let rawHtml = block.textContent || block.innerText;
  if (!rawHtml) {
    console.warn('No content found in block');
    return;
  }

  // Decode HTML entities (for cases where HTML is escaped)
  const textarea = document.createElement('textarea');
  textarea.innerHTML = rawHtml;
  const decodedHtml = textarea.value;

  // Inject the HTML form and script
  block.innerHTML = decodedHtml;

  // Run embedded <script> tags
  const scripts = Array.from(block.querySelectorAll('script'));
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
      newScript.async = false; // keep execution order
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });

  // Move any styles inside block to <head>
  const styles = block.querySelectorAll('style');
  styles.forEach((style) => {
    document.head.appendChild(style);
  });
}
