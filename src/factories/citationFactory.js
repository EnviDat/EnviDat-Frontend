/**
 * function factory for all functionality of citations
*
 * @summary function factory for citations
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';
import { getAuthorsCitationString } from '@/factories/authorFactory';

export function sanitizeUrls(url) {
  if (!url) {
    return null;
  }

  return url.replaceAll('%3A', ':');
}

/**
 * extracts all urls from a string
 * @param {String}text
 * @returns {*|*[]}
 */
export function extractUrlsFromText(text) {
  if (!text) {
    return [];
  }

  const textWithUrls = text;
  // const regExStr = '/[A-Za-z]+:\/\/[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_:%&;\?\#\/.=]+';
  const regExStr = '[A-Za-z]+://[A-Za-z0-9-_]+.[A-Za-z0-9-_:%&;?#/.=]+';
  const regEx = new RegExp(regExStr, 'gm');

  return textWithUrls.match(regEx) || [];
}

/**
 *
 * @param urls
 * @returns {Map<any, any>} Map keys are the url with the PID as value
 */
export function extractPIDsFromUrls(urls) {
  const pidMap = new Map();

  if (urls?.length <= 0) {
    return pidMap;
  }

  // regEx to determine if any url contains a PID from DORA
  // /[a-zA-Z]+(:|%3A)\d+/g
  // PID delimiter is typically ':' but this can be changed via browser url and copy paste
  const regExStr = '[a-zA-Z]+(:|%3A)\\d+';
  const regEx = new RegExp(regExStr, 'g');

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const matches = url.match(regEx);

    if (matches) {
      const pid = matches[0];

      if (pid) {
        const cleanPID = sanitizeUrls(pid);
        pidMap.set(url, cleanPID);
      }
    }
  }

  return pidMap;
}

export function extractPIDsFromText(text) {
  const pidMap = new Map();

  if (!text) {
    return pidMap;
  }

  const regExStr = '[a-zA-Z]+(:|%3A)\\d+';
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
 * @param {Map<any, any>} citationMap Map keys are the PID with the citation text as value
 * @param {Map<string, string>} pidMap Map keys are the url with the PID as value
 * @returns {*}
 */
export function replacePIDsInText(text, citationMap, pidMap) {

  let newText = text;

  if (text) {

    pidMap.forEach((pid, url) => {
      const citation = citationMap.get(pid);
      if (citation) {
        // newText = `<p>${newText.replace(url, citation)}  </p>`;
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

function getGenericCitationObject(citationInfo) {
  const genericCitation = getGenericCitation(citationInfo);

  let abstractTitle = 'Abstract';
  if (citationInfo.object_url) {
    abstractTitle += ` provided by <a href="${citationInfo.object_url}" target="_blank" >DORA</a>:`;
  } else {
    abstractTitle += ':';
  }

  return {
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

export function getPidCitationObjectMap(citationObjs) {

  const citationMap = new Map();
  const pids = Object.entries(citationObjs);

  pids.forEach(entry => {
    const [pid, citationInfo] = entry;

    const citationObj = getGenericCitationObject(citationInfo);
    citationMap.set(pid, citationObj);
  });


  return citationMap;
}

export function getDoiCitationObjectMap(doiObjs) {
  if (!doiObjs) {
    return null;
  }

  const citationMap = new Map();

  doiObjs.forEach((citationInfo) => {
    const citationObj = getGenericCitationObject(citationInfo);
    citationMap.set(citationObj.doi, citationObj);
  });

  return citationMap;
}

/**
 * returns a map with keys which are PIDs or Urls from the text and the values are the PIDs
 *
 * @param {string} text
 * @returns {Map<string, string>} Map keys are the url or a PID with the PID as value
 */
export function extractPIDMapFromText(text) {
  const pidMap = new Map();

  if (!text) {
    return pidMap;
  }

  const urls = extractUrlsFromText(text);
  const urlsPIDMap = extractPIDsFromUrls(urls);

  urlsPIDMap.forEach((value, key) => {
    pidMap.set(key, value);
  });

  // also extract all PIDs from the whole text to catch PIDs with don't have an url
  const onlyPIDs = extractPIDsFromText(text);

  const urlsPIDValues = Array.from(urlsPIDMap.values());

  if (urlsPIDValues.length > 0) {

    // in case there are urls in the text, make sure not to overwrite any
    onlyPIDs.forEach((value, key) => {
      const cleanPID = sanitizeUrls(value);

      if (!urlsPIDValues.includes(cleanPID)) {
        pidMap.set(key, cleanPID);
      }
    });
  } else {

    // in case there are only ids merged as well
    onlyPIDs.forEach((value, key) => {
      const cleanPID = sanitizeUrls(value);

      pidMap.set(key, cleanPID);
    });
  }

  return pidMap;
}

const fallbackPIDUrl = 'https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_pids_wsl/';

export function getDoraPidsUrl(pidMap, resolveBaseUrl) {
  let fullUrl = resolveBaseUrl || fallbackPIDUrl;

  pidMap.forEach((pid) => {
    fullUrl += `${pid}|`;
  });

  fullUrl = fullUrl.substring(0, fullUrl.length - 1);

  return fullUrl;
}

const fallbackDoiUrl = 'https://www.dora.lib4ri.ch/wsl/islandora/search/json_cit_wsl/mods_identifier_doi_mt:';

export function getDoraDoisUrl(doiMap, resolveBaseUrl) {
  let fullUrl = resolveBaseUrl || fallbackDoiUrl;

  doiMap.forEach((doi) => {
    fullUrl += `${doi.replace('/', '~slsh~')}|`;
  });

  fullUrl = fullUrl.substring(0, fullUrl.length - 1);

  return fullUrl;
}

export async function resolveDOIsViaDora(doiMap, resolveBaseUrl = undefined) {
  if (!doiMap) {
    return null;
  }

  const doraUrl = getDoraDoisUrl(doiMap, resolveBaseUrl);

  const response = await axios.get(doraUrl);
  return response.data;
}

export async function resolvePIDsViaDora(pidMap, resolveBaseUrl = undefined) {
  if (!pidMap) {
    return null;
  }

  // get url which works with multiple PIDs
  const doraUrl = getDoraPidsUrl(pidMap, resolveBaseUrl);

  const response = await axios.get(doraUrl);
  return response.data;
}

export async function resolvePidCitationObjectsViaDora(pidMap) {

  const citationObj = await resolvePIDsViaDora(pidMap);

  return getPidCitationObjectMap(citationObj);
}

export async function resolveDoiCitationObjectsViaDora(doiMap) {

  const citationObj = await resolveDOIsViaDora(doiMap);

  return getDoiCitationObjectMap(citationObj);
}

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

export function createCitation(dataset) {
  if (!dataset) {
    return null;
  }

  const ckanDomain = process.env.VITE_API_ROOT;

  const authors = getAuthorsCitationString(dataset);
  const title = dataset.title;

  let { publication } = dataset;

  if (publication && typeof publication === 'string') {
    try {
      publication = JSON.parse(publication);
    } catch (e) {
      console.error(e);
    }
  }

  const publisher = publication?.publisher || '';
  const year = publication?.publication_year || publication?.publicationYear || '';
  const doi = dataset.doi || '';
  const doiUrl = `https://www.doi.org/${doi}`;

  let text = `${authors.trim()}`;
  text += ` (${year}).`;
  text += ` ${title}. `;
  text += ` <span style="font-style: italic;" >${publisher}.</span> `;
  text += ` <a href="${doiUrl}" target="_blank">${doiUrl}</a>. `;

  /*
    text += ` <a href="${ckanDomain}/#/metadata/${dataset.name}" target="_blank">Institutional Repository</a> `;
  */

  return {
    id: dataset.id,
    citationText: text,
    doi,
    doiUrl,
    citationXmlLink: `${ckanDomain}/dataset/${dataset.name}/export/datacite.xml`,
    citationIsoXmlLink: `${ckanDomain}/dataset/${dataset.name}/export/iso19139.xml`,
    citationGCMDXmlLink: `${ckanDomain}/dataset/${dataset.name}/export/gcmd_dif.xml`,
    citationBibtexXmlLink: `${ckanDomain}/dataset/${dataset.name}/export/bibtex.bib`,
    citationRisXmlLink: `${ckanDomain}/dataset/${dataset.name}/export/ris.ris`,
  };
}

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