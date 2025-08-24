
/**
 * Parse the html in to a JSON object.
 * @param {Element} rootElement The HTML conten
 */
export function extractJsonFromHtml(rootElement) {
  let rawText = rootElement.textContent || '';
  rawText = rawText.replace(/\u00a0/g, ' ').trim();

  const startIdx = rawText.indexOf('[');
  const endIdx = rawText.lastIndexOf(']');

  if (startIdx === -1 || endIdx === -1) {
    return null;
  }

  const jsonSnippet = rawText.slice(startIdx, endIdx + 1);

  try {
    return JSON.parse(jsonSnippet);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return null;
  }
}