/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { h } from "hastscript";
import { selectAll, select } from "hast-util-select";
import { toString } from "hast-util-to-string";
import { replace, childNodes } from "../utils/hast-utils.js";

/**
 * Converts the given text to an array of CSS class names:
 * - extracts the list of options (given as CSV in braces at the end)
 * - collapses all consecutive invalid-css name characters to a single `-`
 * - removes leading and trailing `-`
 * - converts all names to lowercase
 *
 * @examples
 *   Columns (fullsize center) --> columns fullsize-center
 *   Columns (fullsize, center) --> columns fullsize center
 *   Joe's Pizza! (small) -> joe-s-pizza small
 *
 * @param {string} text input text
 * @returns {string[]} the array of CSS class names
 */
function toBlockCSSClassNames(text) {
  if (!text) {
    return [];
  }
  const names = [];
  const idx = text.lastIndexOf("(");
  if (idx >= 0) {
    names.push(text.substring(0, idx));
    names.push(...text.substring(idx + 1).split(","));
  } else {
    names.push(text);
  }

  return names
    .map((name) =>
      name
        .toLowerCase()
        .replace(/[^0-9a-z]+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
    )
    .filter((name) => !!name);
}

/**
 * Creates a "DIV representation" of a table.
 * @type PipelineStep
 * @param {HTMLTTableElement} $table the table element
 * @returns {HTMLDivElement} the resulting div
 */
function tableToDivs($table) {
  const $cards = h("div");
  const $rows = [];
  for (const child of $table.children) {
    if (child.tagName === "thead" || child.tagName === "tbody") {
      $rows.push(...childNodes(child));
    }
  }

  if ($rows.length === 0) {
    return $cards;
  }
  const $headerCols = childNodes($rows.shift());

  // special case, only 1 row and 1 column with a nested table
  if ($rows.length === 0 && $headerCols.length === 1) {
    const $nestedTable = select(":scope table", $headerCols[0]);
    if ($nestedTable) {
      return $nestedTable;
    }
  }

  // get columns names
  $cards.properties.className = toBlockCSSClassNames(toString($headerCols[0]));

  // construct page block
  for (const $row of $rows) {
    const $card = h("div");
    for (const $cell of childNodes($row)) {
      // convert to div
      $card.children.push(
        h(
          "div",
          {
            "data-align": $cell.properties.align,
            "data-valign": $cell.properties.vAlign,
          },
          $cell.children
        )
      );
    }
    $cards.children.push($card);
  }
  return $cards;
}

/**
 * Converts tables into page blocks.
 * @param context The current context of processing pipeline
 */
export default function createPageBlocks(content) {
  const { hast } = content;
  selectAll("div > table", hast).forEach(($table) => {
    const $div = tableToDivs($table);
    // replace child in parent
    replace(hast, $table, $div);
  });
}
