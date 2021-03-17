/**
 * function factory for general string conversion with regards to formatting markdown, html
 *
 * @summary functions for string conversion
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-12-03 10:53:30 
 * Last modified  : 2020-12-09 11:47:25
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import remark from 'remark';
import stripMarkdownLib from 'strip-markdown';
import htmlLib from 'remark-html';
import remarkStripHtmlLib from 'remark-strip-html';

export function renderMarkdown(markdownString) {
  if (!markdownString || markdownString.length <= 0) {
    return '';
  }

  const strippedMDFile = remark().use(htmlLib).processSync(markdownString);
  return strippedMDFile.contents;
}

export function stripMarkdown(markdownString, stripHtml = false) {
  if (!markdownString || markdownString.length <= 0) {
    return '';
  }

  const strippedMDFile = remark().use(stripMarkdownLib).processSync(markdownString);

  let strippedString = strippedMDFile.contents;
  if (stripHtml) {
    const strippedHtmlFile = remark().use(remarkStripHtmlLib).processSync(strippedString);
    strippedString = strippedHtmlFile.contents;
  }

  return strippedString;
}
