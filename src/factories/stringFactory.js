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

import md5 from 'tiny-js-md5';
import remark from 'remark';
import remarkBreaks from 'remark-breaks';
import htmlLib from 'remark-html';
import remarkStripHtmlLib from 'remark-strip-html';
import stripMarkdownLib from 'strip-markdown';

export function renderMarkdown(markdownString, sanitizeHTML = true) {
  if (!markdownString || markdownString.length <= 0) {
    return '';
  }

  const strippedMDFile = remark({
    gfm: true,
    commonmark: true,
  })
    .use(remarkBreaks)
    .use(htmlLib, { sanitize: sanitizeHTML })
    .processSync(markdownString);

  return strippedMDFile.contents;
}

export function stripHTML(htmlString) {
  if (!htmlString || htmlString.length <= 0) {
    return '';
  }

  const strippedHtmlFile = remark().use(remarkStripHtmlLib).processSync(htmlString);
  return strippedHtmlFile.contents;
}

export function stripMarkdown(markdownString, stripHtml = false) {
  if (!markdownString || markdownString.length <= 0) {
    return '';
  }

  const strippedMDFile = remark().use(stripMarkdownLib).processSync(markdownString);

  let strippedString = strippedMDFile.contents;
  if (stripHtml) {
    strippedString = stripHTML(strippedString);
  }

  return strippedString;
}

export function getSOLRStringForElements(property, elements, elementProperty = undefined) {
  let query = `${property}:(`; // 'id:(';
  const objectProperty = elementProperty || property;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    let entry = element;

    if (typeof element === 'object') {
      entry = element[objectProperty];
    }

    query += `${entry} OR `;
  }

  // cut away the last " OR "
  query = `${query.substring(0, query.length - 4)})`;

  return query;
}

export function extractBodyIntoUrl(url, body) {
  const keys = Object.keys(body);

  if (keys.length > 0) {
    url += '?';
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i > 0) {
        url += '&';
      }
      url += `${key}=${body[key]}`;
    }
  }

  return url;
}

export function md5Hash(string) {
  return md5(string).toString();
}

function fillMapWithArray(key, value, map) {
  const existingArrayValue = map.get(key);

  if (existingArrayValue) {
    if (value instanceof Array) {
      map.set(key, [...existingArrayValue, ...value]);
    } else {
      existingArrayValue.push(value);
    }
  } else if (value instanceof Array) {
    map.set(key, value);
  } else {
    map.set(key, [value]);
  }
}

let tempLastRuName = '';
let tempLastOrgaName = '';

function getResearchUnitName(orgaName, researchUnits) {
  const lowerOrgaName = orgaName.toLowerCase();

  if (lowerOrgaName === tempLastOrgaName) {
    return tempLastRuName;
  }

  tempLastOrgaName = lowerOrgaName;

  for (let i = 0; i < researchUnits.length; ++i) {
    const unit = researchUnits[i];
    const ruName = unit.name;
    tempLastRuName = ruName;
    const ruNameLower = unit.name.toLowerCase();

    if (ruNameLower.includes(lowerOrgaName)) {
      return ruName;
    }

    if (unit.groups.length > 0) {
      const groups = unit.groups;

      for (let j = 0; j < groups.length; ++j) {
        const groupName = groups[j].toLowerCase();

        if (groupName.includes(lowerOrgaName)) {
          return ruName;
        }
      }
    }
  }

  tempLastRuName = 'others';
  return 'others';
}

export function getResearchUnitDatasets(researchUnitStructure, datasets) {
  if (!researchUnitStructure || !datasets) {
    return null;
  }

  const orgaMap = new Map();

  datasets.forEach((dSet) => {
    const orgaName = dSet.organization.title;
    fillMapWithArray(orgaName, dSet, orgaMap);
  });

  const ruMap = new Map();

  for (const [orgaName] of orgaMap) {
    const orgaDatasets = orgaMap.get(orgaName);
    const ruName = getResearchUnitName(orgaName, researchUnitStructure.researchUnits);
    fillMapWithArray(ruName, orgaDatasets, ruMap);
  }

  return ruMap;
}

/**
 * Encodes a array of string entries via btoa() to a single string.
 * Also replaces theses characters '.', '_', '-' which cause problems for urls.
 *
 * @param {array} array: array of e.g. tagNames
 * @return {String} encoded string usable for urls
 */
export function encodeArrayToUrlString(array) {
  if (array && array.length > 0) {
    const jsonString = JSON.stringify(array);

    const urlString = btoa(jsonString);

    let urlConformString = urlString.replace(/\+/g, '.');
    urlConformString = urlConformString.replace(/\//g, '_');
    urlConformString = urlConformString.replace(/=/g, '-');

    return urlConformString;
  }

  return '';
}

/**
 * Decodes a string which was encoded via encodeArrayToUrlString().
 * Returns the original array or an empty one.
 * Also restores characters '.', '_', '-'.
 *
 * @param {String} urlString: encoded string
 * @return {array}: array of tagNames
 */
export function decodeArrayFromUrlString(urlString) {
  if (urlString) {
    let jsonConformString = urlString.replace(/\./g, '+');
    jsonConformString = jsonConformString.replace(/_/g, '/');
    jsonConformString = jsonConformString.replace(/-/g, '=');

    const jsonString = atob(jsonConformString);
    return JSON.parse(jsonString);
  }

  // return an empty array for the selectedTagIds
  return [];
}

export function convertUrlStringToArray(string, toUpperCase = true, toLowerCase = false) {
  if (!string) {
    return [];
  }

  const splits = string.split(',');

  for (let i = 0; i < splits.length; i++) {
    if (toUpperCase) {
      splits[i] = splits[i].toUpperCase();
    }

    if (toLowerCase) {
      splits[i] = splits[i].toLowerCase();
    }
  }

  return splits;
}

export function convertArrayToUrlString(array, toUpperCase = true, toLowerCase = false) {
  let str = '';
  for (let i = 0; i < array.length; i++) {
    if (toUpperCase) {
      str += `${array[i].toUpperCase()},`;
    }

    if (toLowerCase) {
      str += `${array[i].toLowerCase()},`;
    }
  }

  // remove the last comma
  str = str.substring(0, str.length - 1);

  return str;
}

export function loadRouteTags(tags, selectedTagNames) {
  if (tags && !(tags instanceof Array)) {
    if (tags.includes(',')) {
      tags = tags.split(',');
    } else {
      tags = [tags];
    }
  }

  if (tags) {
    for (let i = 0; i < tags.length; i++) {
      tags[i] = tags[i].toUpperCase();
    }

    if (!this.areArraysIdentical(selectedTagNames, tags)) {
      return tags;
    }
  }

  return [];
}

export function areArraysIdentical(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = arr1.length; i >= 0; i--) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}
