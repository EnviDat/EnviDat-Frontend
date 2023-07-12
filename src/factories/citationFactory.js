/**
 * function factory for function to use with dora services
 * https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_pids/wsl:29664%7Cwsl:21835%7Cwsl:22390
 * https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_pids_wsl/wsl:29664%7Cwsl:21835%7Cwsl:22390
 * https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_wsl/mods_identifier_doi_mt:
 *
 * @summary functions for resovling citations via dora (pids and dois)
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import axios from 'axios';
import { createCitation } from '@/factories/metaDataFactory';


export function getCitationList(datasets, datasetIds) {
  const citations = [];

  if (!datasets || datasets.length <= 0) {
    return citations;
  }

  const datasetMatches = datasets.filter((d) => datasetIds.includes(d.name) || datasetIds.includes(d.id));


  for (let i = 0; i < datasetMatches.length; i++) {
    const c = createCitation(datasetMatches[i]);
    citations.push(c);
  }

  return citations;
}

function sanitizeUrl(url) {
  if (!url) {
    return null;
  }

  return url.replaceAll('%3A', ':');
}


/**
 * regEx to determine if a string contains a url
 * /[A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&;\?\#\/.=]+/g
 * @type {string}
 */
const urlRegExStr = '[A-Za-z]+://[A-Za-z0-9-_]+.[A-Za-z0-9-_:%&;?#/.=]+';

/**
 * regEx to determine if any url contains a PID from DORA
 * /[a-zA-Z]+(:|%3A)\d+/g
 * @type {string}
 */
const pidRegExStr = '[a-zA-Z]+(:|%3A)\\d+';
/**
 * regEx to determine if any url contains a PID from DORA
 * /10.\d{4,9}\/[-._;()/:A-Z0-9]+/ig
 * @type {string}
 */
const doiRegExStr = '10.\\d{4,9}/[-._;()/:a-zA-Z0-9]+';


/**
 * extracts all urls from a string
 * @param {String}text
 * @returns {*|*[]}
 */
function extractUrlsFromText(text) {
  if (!text) {
    return [];
  }

  const textWithUrls = text;
  const regEx = new RegExp(urlRegExStr, 'gm');

  return textWithUrls.match(regEx) || [];
}

/**
 *
 * @param {string[]}urls
 * @param {string} regExStr
 * @returns {Map<string, string>} Map keys are the url with the PID as value
 */
function extractIDsFromUrls(urls, regExStr) {
  const pidMap = new Map();

  if (urls?.length <= 0) {
    return pidMap;
  }

  const regEx = new RegExp(regExStr, 'g');

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const matches = url.match(regEx);

    if (matches) {
      const pid = matches[0];

      if (pid) {
        const cleanPID = sanitizeUrl(pid);
        pidMap.set(url, cleanPID);
      }
    }
  }

  return pidMap;
}

function extractIDsFromText(text, regExStr) {
  const pidMap = new Map();

  if (!text) {
    return pidMap;
  }

  const regEx = new RegExp(regExStr, 'gm');

  const pidMatches = text.match(regEx) || [];

  pidMatches.forEach((match) => {
    pidMap.set(match, match);
  });

  return pidMap;
}

/**
 *
 * @param text
 * @param {Map<string, object>} citationMap Map keys are the PID with the citation text as value
 * @param {Map<string, string> | null} idMap Map keys are the url with the PID as value
 * @returns {*}
 */
export function replaceIdsInText(text, citationMap, idMap) {

  let newText = text;

  if (text && idMap) {

    idMap.forEach((id, url) => {
      const citationObj = citationMap.get(id);
      const citation = citationObj?.citation;
      if (citation) {
        newText = newText.replace(url, `${citation} <br /> <br />`);
      }
    });

  }

  return newText;
}

function getGenericCitation(resolvedObject) {
  // don't use the ACS or APA or any property explicit of the citation
  // if any time the style of the citation is changed, the code would fail
  // in this generic way, the first citation will be used no matter the name
  const citationObj = resolvedObject?.citation || {};
  const keys = Object.keys(citationObj);
  return citationObj[keys[0]];
}

function getGenericCitationObject(citationInfo, pid = undefined) {
  if (!citationInfo) {
    return null;
  }

  const genericCitation = getGenericCitation(citationInfo);

  let abstractTitle = 'Abstract';
  if (citationInfo.object_url) {
    abstractTitle += ` provided by <a href="${citationInfo.object_url}" target="_blank" >DORA</a>:`;
  } else {
    abstractTitle += ':';
  }

  return {
    pid: citationInfo.pid || pid,
    citation: genericCitation || null,
    abstract: citationInfo.abstract ? `${abstractTitle} \n ${citationInfo.abstract}` : null,
    doraSiteUrl: citationInfo.object_url,
    doi: citationInfo.doi,
    doiUrl: `https://www.doi.org/${citationInfo.doi}`,
  };
}

/**
 *
 * @param resolvedPubs
 * @param pidMap
 * @returns {Map<any, any>} Map keys are the PID with the citation text as value
 */
export function resolvedCitationText(resolvedPubs, pidMap) {
  const citationTextMap = new Map();

  pidMap.forEach((pid) => {
    const resolvedObject = resolvedPubs[pid];

    const genericCitation = getGenericCitation(resolvedObject);

    if (genericCitation) {
      citationTextMap.set(pid, genericCitation);
    }
  });

  return citationTextMap;
}

/**
 *
 * @param citationObjs
 * @param citationIdProperty
 * @returns {Map<string, object>}
 */
function getCitationObjectMap(citationObjs, citationIdProperty) {
  const citationMap= new Map();

  if (!citationObjs) {
    return citationMap;
  }

  citationObjs.forEach((citationInfo) => {
    const citationObj = getGenericCitationObject(citationInfo);
    if (citationObj) {
      citationMap.set(citationObj[citationIdProperty], citationObj);
    }
  });

  return citationMap;
}

const fallbackPIDUrl = 'https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_pids_wsl/';

/**
 * returns a url to call for multiple pids
 * @param pidMap
 * @param resolveBaseUrl
 * @returns {string} 
 */
function getDoraPidsUrl(pidMap, resolveBaseUrl) {
  let fullUrl = resolveBaseUrl || fallbackPIDUrl;

  pidMap.forEach((pid) => {
    fullUrl += `${pid}|`;
  });

  fullUrl = fullUrl.substring(0, fullUrl.length - 1);

  return fullUrl;
}

const fallbackDoiUrl = 'https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_wsl/mods_identifier_doi_mt:';

function getDoraDoisUrls(doiMap, resolveBaseDOIUrl) {
  const urls = [];
  const baseUrl = resolveBaseDOIUrl || fallbackDoiUrl;

  doiMap.forEach((doi, url) => {
    const doiUrl = `${baseUrl}${doi.replace('/', '~slsh~')}`;
    urls.push(doiUrl);
  });

  return urls;
}

async function resolveDOIsViaDora(doiMap, resolveBaseDOIUrl = undefined) {
  if (!doiMap) {
    return null;
  }

  const doiUrls = getDoraDoisUrls(doiMap, resolveBaseDOIUrl);

  const doiResponses = [];
  doiUrls.forEach((url) => {
    doiResponses.push(axios.get(url));
  });

  const responses = await Promise.all(doiResponses);

  const data = [];
  responses.forEach((res) => {
    if(res.data?.length > 0) {
      data.push(res.data[0]);
    }
  });

  return data;
}

async function resolvePIDsViaDora(pidMap, resolveBaseUrl) {
  if (!pidMap) {
    return null;
  }

  // get url which works with multiple PIDs
  const doraUrl = getDoraPidsUrl(pidMap, resolveBaseUrl);

  const response = await axios.get(doraUrl);
  return response.data;
}

/**
 * Expecting an object with the pids as keys and their citaion object as value.
 * eg: https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_pids/wsl:14249|wsl:21835
 * @param responseObj
 * @returns {*[]}
 */
function convertPidMapToArray(responseObj) {

  const pidKeys = Object.keys(responseObj);
  const pidObjects = [];

  for (let i = 0; i < pidKeys.length; i++) {
    const pid = pidKeys[i];
    const citationObj = getGenericCitationObject(responseObj[pid], pid);
    if (citationObj) {
      pidObjects.push(citationObj);
    }
  }

  return pidObjects;
}

export async function resolvePidCitationObjectsViaDora(pidMap, resolveBaseUrl = undefined) {

  let citationObjs = await resolvePIDsViaDora(pidMap, resolveBaseUrl);

  if (!Array.isArray(citationObjs)) {
    citationObjs = convertPidMapToArray(citationObjs);
  }

  return getCitationObjectMap(citationObjs, 'pid');
}

export async function resolveDoiCitationObjectsViaDora(doiMap, resolveBaseDOIUrl = undefined) {

  const citationObjs = await resolveDOIsViaDora(doiMap, resolveBaseDOIUrl);

  return getCitationObjectMap(citationObjs, 'doi');
}

/**
 * returns a map with keys which are PIDs or Urls from the text and the values are the PIDs
 *
 * @param {string} text
 * @param {string} regExStr
 * @returns {Map<string, string>} Map keys are the url or a PID with the PID as value
 */
function extractIDMapFromText(text, regExStr) {
  const idMap = new Map();

  if (!text) {
    return idMap;
  }

  const urls = extractUrlsFromText(text);
  const urlsIdMap = extractIDsFromUrls(urls, regExStr);

  urlsIdMap.forEach((value, key) => {
    idMap.set(key, value);
  });

  // also extract all PIDs from the whole text to catch PIDs aren't part of an url
  const onlyIds = extractIDsFromText(text, regExStr);

  const urlsIdValues = Array.from(urlsIdMap.values());

  onlyIds.forEach((value, key) => {
    const cleanPID = sanitizeUrl(value);

    if (urlsIdValues.length > 0) {
      // in case there are urls in the text, make sure not to dublicate the ids
      // via regex (once total url and once from the id only)
      if (!urlsIdValues.includes(cleanPID)) {
        idMap.set(key, cleanPID);
      }
    } else {
      // in case there are only ids merged as well
      idMap.set(key, cleanPID);
    }
  });

  return idMap;
}

export function extractPIDMapFromText(text) {
  return extractIDMapFromText(text, pidRegExStr);
}

export function extractDOIMapFromText(text) {
  return extractIDMapFromText(text, doiRegExStr);
}

/*
export function extractDOIMapFromText(text) {
  const doiMap = new Map();

  if (!text) {
    return doiMap;
  }

  const urls = extractUrlsFromText(text);
  const urlsdoiMap = extractIDsFromUrls(urls, doiRegExStr);

  urlsdoiMap.forEach((value, key) => {
    doiMap.set(key, value);
  });

  // also extract all PIDs from the whole text to catch PIDs aren't part of an url
  const onlyDOIs = extractIDsFromText(text, doiRegExStr);

  const urlsDOIValues = Array.from(urlsdoiMap.values());

  onlyDOIs.forEach((value, key) => {
    const cleanDOI = sanitizeUrl(value);

    if (urlsDOIValues.length > 0 && !urlsDOIValues.includes(cleanDOI)) {
      // in case there are urls in the text, make sure not to overwrite any
      doiMap.set(key, cleanDOI);
    } else {
      // in case there are only ids merged as well
      doiMap.set(key, cleanDOI);
    }
  });

  return doiMap;
}
*/

export function extractDatasetIdsFromText(text) {
  const ids = [];

  if (!text) {
    return ids;
  }

  const regExStr = '/#/metadata/[a-zA-Za_-\\d]+';
  const regEx = new RegExp(regExStr, 'gm');

  const matches = text.match(regEx) || [];

  for (let i = 0; i < matches.length; i++) {

    const match = matches[i];
    const splits = match.split('/');

    if (splits.length > 0) {
      const id = splits[splits.length - 1];
      ids.push(id);
    }
  }

  return ids;
}
