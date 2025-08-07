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

  // Parse decoded HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(decodedHtml, 'text/html');

  // --- Extract and inject <component :is="'style'"> styles first ---
  const componentStyles = doc.querySelectorAll('component[\\:is="\'style\'"]');
  componentStyles.forEach(component => {
    const styleTag = document.createElement('style');
    styleTag.textContent = component.textContent;
    document.head.appendChild(styleTag);
    component.remove();
  });

  // --- Handle <component async :is="'script'"> ---
  const componentScripts = doc.querySelectorAll('component[async][\\:is="\'script\'"]');
  let combinedScript = '';
  componentScripts.forEach(component => {
    combinedScript += component.textContent + '\n';
    component.remove();
  });

  // Serialize cleaned HTML back
  decodedHtml = doc.body.innerHTML;

  // Inject cleaned HTML after styles are in place
  block.innerHTML = decodedHtml;

  // Execute normal <script> tags in injected HTML
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

  // Execute extracted <component> script code
  if (combinedScript.trim()) {
    const scriptTag = document.createElement('script');
    scriptTag.textContent = combinedScript;
    document.body.appendChild(scriptTag);
  }

  // Move any leftover <style> tags from block to head (if needed)
  // const styles = block.querySelectorAll('style');
  // styles.forEach(style => {
  //   if (!document.head.contains(style)) {
  //     document.head.appendChild(style.cloneNode(true));
  //   }
  // });
  const styles = block.querySelectorAll('style');
  styles.forEach(style => {
  const exists = [...document.head.querySelectorAll('style')].some(s => s.textContent === style.textContent);
  if (!exists) {
    document.head.appendChild(style.cloneNode(true));
  }
});

}
