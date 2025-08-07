export default async function decorate(block) {
  const raw = block.textContent || block.innerText;
  if (!raw) {
    console.warn('No embedded script found in block');
    return;
  }

  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = raw;
  let decodedHtml = textarea.value;

  // Remove <component async :is="'script'"> ... </component> blocks
  // Using regex - be careful with nested tags, this assumes no nesting inside those tags
  decodedHtml = decodedHtml.replace(/<component[^>]*async[^>]*:is=['"]script['"][^>]*>[\s\S]*?<\/component>/gi, '');

  // Inject cleaned HTML
  block.innerHTML = decodedHtml;

  // Execute <script> tags
  const scripts = block.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
      newScript.async = false;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });

  // Move <style> tags to <head>
  const styles = block.querySelectorAll('style');
  styles.forEach(style => {
    if (!document.head.contains(style)) {
      document.head.appendChild(style.cloneNode(true));
    }
  });
}
