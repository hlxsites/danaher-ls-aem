import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import {
  a, div,
} from '../../scripts/dom-builder.js';
import { makePublicUrl } from '../../scripts/scripts.js';


function extractJsonFromHtml(rootElement) {
 // Get all text in the element (without tags)
  let rawText = rootElement.textContent || "";

  // Clean up non-breaking spaces
  rawText = rawText.replace(/\u00a0/g, " ").trim();

  // Find the JSON-like part
  const startIdx = rawText.indexOf("["); // change to '{' if needed
  const endIdx = rawText.lastIndexOf("]");

  if (startIdx === -1 || endIdx === -1) {
    console.error("JSON array not found inside element");
    return null;
  }

  const jsonSnippet = rawText.slice(startIdx, endIdx + 1);

  try {
    return JSON.parse(jsonSnippet);
  } catch (err) {
    console.error("Error parsing JSON:", err);
    console.log("Extracted snippet:\n", jsonSnippet);
    return null;
  }
}

export default function decorate(block) {
  const messyHtml = block.children[1].children[3];
  let parsedData = extractJsonFromHtml(messyHtml);
  console.log("Parsed JSON object:", parsedData);
}
