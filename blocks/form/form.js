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

  // Create a DOM parser to manipulate the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(decodedHtml, 'text/html');

  // Find all <component async :is="'script'"> elements
  const componentScripts = doc.querySelectorAll('component[async][\\:is="\'script\'"]');

  // Extract and concatenate all JS code inside those <component> tags
  let combinedScript = '';
  componentScripts.forEach(component => {
    combinedScript += component.textContent + '\n';
    // Remove the component from DOM so it won't render
    component.remove();
  });

  // Serialize the cleaned HTML back to string
  decodedHtml = doc.body.innerHTML;

  // Inject cleaned HTML into the block
  block.innerHTML = decodedHtml;

  // Execute any regular <script> tags inside injected HTML
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

  // Execute the extracted JS from <component> tags manually
  if (combinedScript.trim()) {
    const scriptTag = document.createElement('script');
    scriptTag.textContent = combinedScript;
    document.body.appendChild(scriptTag);
  }

  // Move <style> tags to <head>
  const styles = block.querySelectorAll('style');
  styles.forEach(style => {
    if (!document.head.contains(style)) {
      document.head.appendChild(style.cloneNode(true));
    }
  });
}
