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
import Crypto from 'crypto-js';
import Cookie from 'js-cookie';
import uuid from 'uuid';

export function renderMarkdown(markdownString, sanitizeHTML = true) {
  if (!markdownString || markdownString.length <= 0) {
    return '';
  }

  const strippedMDFile = remark().use(htmlLib, { sanitize: sanitizeHTML}).processSync(markdownString);
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

export function encryptString(string, encryptionKey) {
  const encrypted = Crypto.AES.encrypt(string, encryptionKey);
  return encrypted.toString();
}

/**
 *
 * @param string
 * @param encryptionKey
 * @returns {any}
 * @throws SyntaxError
 */
export function decryptString(string, encryptionKey) {
  const bytes = Crypto.AES.decrypt(string, encryptionKey);

  return JSON.parse(bytes.toString(Crypto.enc.Utf8));
}

export function GetEncryptedKeyFromCookie(cookieName) {
  // Get the encryption token from cookie or generate a new one.
  const encryptionToken = Cookie.get(cookieName) || uuid.v4();

  // Store the encryption token in a secure cookie.
  Cookie.set(cookieName, encryptionToken, { secure: true, expires: 7 });

  return Crypto.SHA3(encryptionToken, { outputLength: 512 }).toString();
}

export function md5Hash(string) {
  return Crypto.MD5(string).toString();
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

export function getResearchUnitDatasets (researchUnitStructure, datasets) {
  if (!researchUnitStructure || !datasets) {
    return null;
  }

  const orgaMap = new Map();

  datasets.forEach(dSet => {

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
