// eslint-disable-next-line import/prefer-default-export
export function extractJsonFromHtml(rootElement) {
  let rawText = rootElement.textContent || '';
  rawText = rawText.replace(/\u00a0/g, ' ').trim();

  // Look for array or object root
  const startArr = rawText.indexOf('[');
  const endArr = rawText.lastIndexOf(']');
  const startObj = rawText.indexOf('{');
  const endObj = rawText.lastIndexOf('}');

  let jsonSnippet = null;

  // Prefer array if present, otherwise object
  if (startArr !== -1 && endArr !== -1) {
    jsonSnippet = rawText.slice(startArr, endArr + 1);
  } else if (startObj !== -1 && endObj !== -1) {
    jsonSnippet = rawText.slice(startObj, endObj + 1);
  } else {
    return null;
  }

  try {
    return JSON.parse(jsonSnippet);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return null;
  }
}
