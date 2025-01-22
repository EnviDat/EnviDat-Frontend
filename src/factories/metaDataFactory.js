/**
 * function factory for metadata object creation methods by parsing
 * the json from the backend.
 *
 * @summary function factory for metadata object creation methods
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import seedrandom from 'seedrandom';

import { getAuthorName, getAuthorsString } from '@/factories/authorFactory';

import { ACCESS_LEVEL_PUBLIC_VALUE, getAllowedUserNamesArray } from '@/factories/userEditingFactory';

import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FULLNAME,
  METADATA_STATE_DRAFT,
  METADATA_STATE_INVISILBE,
  METADATA_STATE_VISILBE,
  METADATA_TITLE_PROPERTY,
  PUBLICATION_STATE_PENDING,
  PUBLICATION_STATE_PUBLISHED,
  PUBLICATION_STATE_RESERVED,
} from '@/factories/metadataConsts';

import categoryCards, { cardImageBgs } from '@/store/categoryCards';
import { enhanceTags, getCategoryColor, guessTagCategory } from '@/factories/keywordsFactory';
import { createLocation } from '@/factories/geoFactory';
import { getMetadataVisibilityState } from '@/factories/publicationFactory';
import { formatDate } from '@/factories/dateFactory';
import { enhanceMetadataWithModeExtras } from '@/factories/modeFactory';

// import { getResourcesDownloads } from '@/modules/matomo/store/matomoStore';

/**
 * Create a pseudo random integer based on a given seed using the 'seedrandom' lib.
 *
 * @param {Number} min
 * @param {Number} max
 * @param {String} seed
 */
export function randomInt(min, max, seed = 'For the Horde!') {
  const rng = seedrandom(seed);
  const r = Math.floor(rng() * 10);

  if (r > max) {
    return max;
  }
  if (r < min) {
    return min;
  }

  return r;
}

// TODO: check with Dominik
export function getPublicationStatus(metadata) {
  const publicationStatus = metadata.publication_state;

  return publicationStatus;
}

export function createLicense(dataset) {
  if (!dataset) {
    return null;
  }

  return {
    id: dataset.license_id,
    title: dataset.license_title,
    url: dataset.license_url,
  };
}

export function createHeader(dataset, smallScreen) {
  if (!dataset) {
    return null;
  }
  let { maintainer } = dataset;

  if (typeof dataset.maintainer === 'string') {
    try {
      maintainer = JSON.parse(dataset.maintainer);
    } catch (e) {
      console.error(`Maintainer json parse err: ${e}`);
    }
  }

  const contactEmail = maintainer?.email || '';

  let authors = null;

  if (typeof dataset.author === 'string') {
    try {
      authors = JSON.parse(dataset.author);
    } catch (e) {
      console.error(`Author json parse err: ${e}`);
    }
  } else if (dataset.author instanceof Array) {
    authors = dataset.author;
  }

  const visibility = getMetadataVisibilityState(dataset);
  const publicationStatus = getPublicationStatus(dataset);
  const created = formatDate(dataset.metadata_created);
  const modified = formatDate(dataset.metadata_modified);

  return {
    [METADATA_TITLE_PROPERTY]: dataset.title,
    doi: dataset.doi,
    [METADATA_CONTACT_FULLNAME]: maintainer ? getAuthorName(maintainer) : '',
    [METADATA_CONTACT_EMAIL]: contactEmail,
    tags: dataset.tags,
    titleImg: dataset.titleImg,
    maxTags: smallScreen ? 1 : 12,
    authors,
    categoryColor: dataset.categoryColor,
    organization: dataset.organization?.name || '',
    organizationTooltip: dataset.organization?.title || '',
    metadataState: visibility,
    publicationStatus,
    spatialInfo: dataset.spatial_info,
    created,
    modified,
  };
}

export function createBody(dataset, smallScreen = false) {
  if (!dataset) {
    return null;
  }

  return {
    // id: dataset.id,
    // doi: dataset.doi,
    text: dataset.notes,
    maxTextLength: smallScreen ? 900 : 1000,
  };
}

export function createPublications(dataset) {
  if (!dataset) {
    return null;
  }

  return {
    text: dataset.related_publications,
    maxTextLength: 500,
  };
}

export function createRelatedDatasets(dataset) {
  if (!dataset) {
    return null;
  }

  return {
    text: dataset.related_datasets,
    maxTextLength: 1000,
  };
}

export function createFunding(dataset) {
  if (!dataset) {
    return null;
  }

  if (typeof dataset.funding === 'string') {
    try {
      const fundingArray = JSON.parse(dataset.funding);

      const funding = [];

      for (let i = 0; i < fundingArray.length; i++) {
        const fund = fundingArray[i];
        funding.push({
          institution: fund.institution,
          grantNumber: fund.grant_number,
          institutionUrl: fund.institution_url,
        });
      }

      return funding;
    } catch (e) {
      console.error(`Error JSON Parse of Funding: ${e}`);
    }
  }

  return dataset.funding;
}

export function createPublishingInfo(dataset) {
  if (!dataset) {
    return null;
  }

  let { publication } = dataset;

  if (typeof publication === 'string') {
    publication = JSON.parse(dataset.publication);
  }

  return {
    publisher: publication.publisher,
    publicationYear: publication.publication_year,
    publicationState: dataset.publication_state,
    doi: dataset.doi,
  };
}

export function getFileFormat(file) {
  let fileFormat = '';
  let fileName = '';

  if (typeof file === 'object' && !!file.format) {
    // if the input is a resource object
    fileName = file.format;
  } else if (typeof file === 'object') {
    fileName = file.name ? file.name : '';
  } else if (typeof file === 'string') {
    fileName = file;
  }

  const splits = fileName.split('.');
  fileFormat = splits[splits.length - 1];
  /*  const last = splits[splits.length - 1];

  if (last?.length > 4) {
    fileFormat = 'url';
  } else {
    fileFormat = last;
  }
*/

  fileFormat = fileFormat.toLowerCase();

  return fileFormat;
}

/**
 * public case: "{"allowed_users": "", "level": "public", "shared_secret": ""}"
 * public (used to be restricted) case: "{"allowed_users": "adrian_meyer,zweifel", "level": "public", "shared_secret": ""}"
 * restricted signin & same organization case: "{"allowed_users": "", "level": "same_organization", "shared_secret": ""}"
 * restricted signin & same organization & specific users case: "{"allowed_users": "zhichao_he,zeljka_vulovic", "level": "same_organization", "shared_secret": ""}"
 *
 * @param resource {object}
 * @param resourceOrganizationID {string}
 * @param signedInUserName {string}
 * @param signedInUserOrganizationIds {string[]}
 * @returns {boolean|null}
 */
export function isResourceProtectedForUser(
  resource,
  resourceOrganizationID,
  signedInUserName,
  signedInUserOrganizationIds,
) {
  if (!resource) return null;

  let allowedUsers = '';
  const restrictedInfo = resource.restricted;
  let isProtected = false;
  let isPublic = false;

  if (typeof restrictedInfo === 'string' && restrictedInfo.length > 0) {
    try {
      const restrictedObj = JSON.parse(restrictedInfo);
      isPublic = restrictedObj.level === ACCESS_LEVEL_PUBLIC_VALUE;
      isProtected =
        !!restrictedObj.level &&
        restrictedObj.level !== ACCESS_LEVEL_PUBLIC_VALUE;
      allowedUsers =
        restrictedObj.allowed_users || restrictedObj.allowedUsers || '';
      // "{"allowed_users": "", "level": "public", "shared_secret": ""}"
    } catch (err) {
      isPublic = restrictedInfo.includes(ACCESS_LEVEL_PUBLIC_VALUE);
      isProtected = !isPublic;
    }
  }

  if (isPublic) {
    return false;
  }

  if (!signedInUserOrganizationIds) {
    return isProtected;
  }

  if (resourceOrganizationID && signedInUserOrganizationIds.length > 0) {
    isProtected = !signedInUserOrganizationIds.includes(resourceOrganizationID);
  }

  if (!signedInUserName) {
    return isProtected;
  }

  if (allowedUsers) {
    const names = getAllowedUserNamesArray(allowedUsers);
    isProtected = !names.includes(signedInUserName);
  }

  return isProtected;
}

export function createResource(
  resource,
  datasetName,
  resourceOrganizationID,
  signedInUserName,
  signedInUserOrganizationIds,
  numberOfDownload,
) {
  if (!resource) {
    return null;
  }
  const isProtected = isResourceProtectedForUser(
    resource,
    resourceOrganizationID,
    signedInUserName,
    signedInUserOrganizationIds,
  );

  let fileFormat = resource.format ? resource.format : '';
  fileFormat = fileFormat.replace('.', '').toLowerCase();

  const created = formatDate(resource.created);
  const modified = formatDate(resource.last_modified);

  const ckanDomain = process.env.VITE_API_ROOT;

  const resURL = resource.url;
  let fileName = resource.name;

  if (!fileName && resURL) {
    const urlSplits = resURL.split('/');
    if (urlSplits.length > 0) {
      fileName = urlSplits[urlSplits.length - 1];
    }
  }

  return {
    // "hash": "",
    description: resource.description,
    // "cache_last_updated": null,
    metadataId: resource.package_id,
    // "mimetype_inner": null,
    // url_type: "upload",
    id: resource.id,
    size: resource.size ? resource.size : 0,
    mimetype: resource.mimetype || '',
    doi: resource.doi,
    name: fileName,
    url: resURL,
    urlType: resource.url_type,
    restrictedUrl: `${ckanDomain}/dataset/${datasetName}/restricted_request_access/${resource.id}`,
    restricted: resource.restricted || '',
    format: fileFormat,
    numberOfDownload,
    state: resource.state || '',
    created,
    deprecated: !!resource.deprecated,
    lastModified: modified,
    position: resource.position || '',
    isProtected,
    previewUrl: resource.previewUrl || null,
  };
}

export function createResources(
  dataset,
  signedInUser,
  signedInUserOrganizationIds,
) {
  if (!dataset) {
    return null;
  }

  const organizationID = dataset.organization?.id;
  const signedInUserName = signedInUser?.name;

  const resources = [];

  let { maintainer } = dataset;

  if (typeof dataset.maintainer === 'string') {
    maintainer = JSON.parse(dataset.maintainer);
  }

  let contactEmail = dataset.maintainer_email;
  if (!dataset.maintainer_email && maintainer) {
    contactEmail = maintainer.email ? maintainer.email : '';
  }

  if (dataset.resources) {
    dataset.resources.forEach(async element => {
      // get the number of download from matomo API
      // const numberOfDownload = await getResourcesDownloads(element.name);
      const res = createResource(
        element,
        dataset.name,
        organizationID,
        signedInUserName,
        signedInUserOrganizationIds,
      );
      // numberOfDownload,
      res.metadataContact = contactEmail;

      resources.push(res);
    });
  }

  return {
    metadataId: dataset.id,
    [METADATA_TITLE_PROPERTY]: dataset.title,
    doi: dataset.doi,
    resources,
  };
}

export function createDetails(dataset) {
  if (!dataset) {
    return null;
  }

  const details = [];

  details.push({
    label: 'Title',
    text: dataset.title,
  });

  const authors = getAuthorsString(dataset);
  details.push({
    label: 'Authors',
    text: authors,
  });

  // TODO DataCRedit

  details.push({
    label: 'DOI',
    text: dataset.doi,
    url: `https://doi.org/${dataset.doi}`,
  });

  const created = formatDate(dataset.metadata_created);
  details.push({
    label: 'Created',
    text: created,
  });

  const modified = formatDate(dataset.metadata_modified);
  details.push({
    label: 'Last Modified',
    text: modified,
  });

  const license = createLicense(dataset);
  details.push({
    label: 'License',
    text: license.title,
    url: license.url,
  });

  details.push({
    label: 'MetadataId',
    text: dataset.id,
  });

  if (dataset.swissFL_type) {
    details.push({
      label: 'swissFL_type',
      text: dataset.swissFL_type,
    });
  }

  return details;
}


let lastCategory = '';
let tempImgKeys = [];
let tempImgValues = [];

/**
 * @param {object} metadata
 *
 * @return {object} metadata entry enhanced with a title image based on its tags
 */
export function enhanceTitleImg(metadata) {
  if (!metadata) {
    return null;
  }

  /* eslint-disable no-param-reassign */
  const category = guessTagCategory(metadata.tags);

  if (cardImageBgs) {
    if (category !== lastCategory) {
      const categoryImages = cardImageBgs[category];
      tempImgKeys = Object.keys(categoryImages);
      tempImgValues = Object.values(categoryImages);
      lastCategory = category;
    }

    const max = tempImgKeys.length - 1;
    const randomIndex = randomInt(0, max, metadata.title);

    metadata.titleImg = randomIndex >= 0 ? tempImgValues[randomIndex] : 0;
  }

  metadata.categoryColor = getCategoryColor(category, categoryCards);

  return metadata;
}

/**
 * @param {Object} metadataEntry
 *
 * @return {Object} metadataEntry enhanced with a title image based on the entrys tags
 */
export function enhanceMetadataEntry(metadataEntry) {
  if (!metadataEntry || !cardImageBgs) {
    return null;
  }

  if (!metadataEntry.titleImg) {
    enhanceTitleImg(metadataEntry);
  }

  return metadataEntry;
}

/**
 * @param {Array} metadatas
 * @return {Array} metadatas enhanced with a title image based on the metadatas tags
 */
export function enhanceMetadatasTitleImage(metadatas) {
  if (metadatas === undefined) {
    return undefined;
  }

  if (Array.isArray(metadatas)) {
    for (let i = 0; i < metadatas.length; i++) {
      const el = metadatas[i];

      if (!el.titleImg) {
        metadatas[i] = enhanceTitleImg(el);
      }
    }
  }

  return metadatas;
}

export function sortObjectArray(arrOfObjects, sortProperty, sort = 'ASC') {
  if (sort === 'ASC') {
    return arrOfObjects.sort((a, b) =>
      a[sortProperty].toUpperCase() > b[sortProperty].toUpperCase() ? 1 : -1,
    );
  }

  return arrOfObjects.sort((a, b) =>
    b[sortProperty].toUpperCase() > a[sortProperty].toUpperCase() ? 1 : -1,
  );
}

/**
 *
 * for details: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 * @param {*} a
 * @param {*} b
 */
export function formatBytes(a, b = 2) {
  /* eslint-disable prefer-template */
  /* eslint-disable no-restricted-properties */
  if (a === 0) return '0 Bytes';

  const c = 1024;

  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const f = Math.floor(Math.log(a) / Math.log(c));

  return parseFloat((a / c ** f).toFixed(b)) + ' ' + e[f];
}

/**
 * Different States of dataset publication (on DataCite for a DOI registration) not to confuse with the different
 * dataset visibility!
 *
 * @type {string[]}
 */
export const possiblePublicationStates = [
  '', // defaults to 'draft' in the components
  PUBLICATION_STATE_RESERVED,
  PUBLICATION_STATE_PENDING,
  PUBLICATION_STATE_PUBLISHED,
];

export const possibleVisibilityStates = [
  METADATA_STATE_DRAFT,
  METADATA_STATE_INVISILBE,
  METADATA_STATE_VISILBE,
];

/**
 *
 * @param {object[]}datasets
 * @param {string}mode
 * @returns {{}}
 */
export function enhanceMetadatas(datasets, mode = undefined) {

  if (!(datasets instanceof Array)) {
    throw new Error(
      `enhanceMetadatas() expects an array of datasets got ${typeof datasets}`,
    );
  }

  const enhancedContent = {};

  for (let i = 0; i < datasets.length; i++) {
    let dataset = datasets[i];
    dataset = enhanceMetadataEntry(dataset);

    if (mode) {
      dataset = enhanceMetadataWithModeExtras(mode, dataset);
    }

    dataset = enhanceTags(dataset, categoryCards);

    dataset.location = createLocation(dataset);

    enhancedContent[dataset.id] = dataset;
  }

  return enhancedContent;
}

export function localSearch(searchTerm, datasets) {
  const foundDatasets = [];

  let term1 = searchTerm.toLowerCase();
  let term2 = '';
  const check2Terms = searchTerm.includes(' ');

  if (check2Terms) {
    const splits = searchTerm.toLowerCase().split(' ');
    term1 = splits[0];
    term2 = splits[1];
  }

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];
    const match1 =
      dataset.title?.toLowerCase().includes(term1) ||
      dataset.author?.toLowerCase().includes(term1) ||
      dataset.notes?.toLowerCase().includes(term1);

    let match2 = true;
    if (check2Terms) {
      match2 =
        dataset.title?.toLowerCase().includes(term2) ||
        dataset.author?.toLowerCase().includes(term2) ||
        dataset.notes?.toLowerCase().includes(term2);
    }

    if (match1 && match2) {
      foundDatasets.push(dataset);
    }
  }

  return foundDatasets;
}

export function isTagSelected(tagName, selectedTagNames) {
  if (!tagName || selectedTagNames === undefined) {
    return false;
  }

  return selectedTagNames.indexOf(tagName) >= 0;
}

