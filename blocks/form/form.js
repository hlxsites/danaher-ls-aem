export default async function decorate(block) {
  // 1. Extract HTML (escaped by richtext editor)
  let rawHtml = block.textContent || block.innerText;
  if (!rawHtml) {
    console.warn('No content found in block');
    return;
  }

  // 2. Decode escaped HTML
  const textarea = document.createElement('textarea');
  textarea.innerHTML = rawHtml;
  const decodedHtml = textarea.value;

  // 3. Inject into block
  block.innerHTML = decodedHtml;

  // 4. Run embedded <script> tags
  const scripts = block.querySelectorAll('script');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }
    script.replaceWith(newScript);
  });

  // 5. Move <style> tags to <head> if needed
  const styles = block.querySelectorAll('style');
  styles.forEach((style) => {
    document.head.appendChild(style);
  });
}
