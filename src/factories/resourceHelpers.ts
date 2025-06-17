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

import {
  ACCESS_LEVEL_PUBLIC_VALUE,
  getAllowedUserNamesArray,
} from '@/factories/userEditingFactory';

import { METADATA_TITLE_PROPERTY } from '@/factories/metadataConsts';

import { formatDate } from '@/factories/dateFactory';
import { DatasetDTO, ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { Resource } from '@/types/modelTypes';



/*
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
  /!*  const last = splits[splits.length - 1];

  if (last?.length > 4) {
    fileFormat = 'url';
  } else {
    fileFormat = last;
  }
*!/

  fileFormat = fileFormat.toLowerCase();

  return fileFormat;
}
*/

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

export function getResourceName(resource: ResourceDTO) {
  let name = resource.name ?? 'Unnamed resource';

  const isUrl = !resource.name && !!resource.url;
  if (isUrl) {
    const splits = resource.url.split('/');
    name = splits[splits.length - 1];
  }

  // @ts-ignore
  return resource.deprecated ? `[DEPRECATED] - ${name}` : name;
}

export function createResource(
  resource: ResourceDTO,
  datasetName: string,
  resourceOrganizationID: string,
  signedInUserName: string,
  signedInUserOrganizationIds: string,
  numberOfDownload?: number,
): Resource | null {
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
    name: getResourceName(resource),
    url: resource.url,
    urlType: resource.url_type,
    restrictedUrl: `${ckanDomain}/dataset/${datasetName}/restricted_request_access/${resource.id}`,
    restricted: resource.restricted || '',
    format: fileFormat,
    numberOfDownload,
    state: resource.state || '',
    created,
    deprecated: !!resource.deprecated,
    lastModified: modified,
    position: resource.position || 0,
    isProtected,
    previewUrl: resource.previewUrl,
    chartLabels: undefined,
    chartData: undefined,
    chartDataLoading: false,
  };
}

export function createResources(
  dataset: DatasetDTO,
  signedInUser: string,
  signedInUserOrganizationIds: string,
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

  let contactEmail = maintainer.email;
  if (!contactEmail && dataset.maintainer_email) {
    contactEmail = dataset.maintainer_email;
  }

  if (dataset.resources) {
    dataset.resources.forEach(async (element) => {
      // get the number of download from matomo API
      // const numberOfDownload = await getResourcesDownloads(element.name);
      const res = createResource(
        element,
        dataset.name,
        organizationID,
        signedInUserName,
        signedInUserOrganizationIds,
        // numberOfDownload,
      );
      // numberOfDownload,

      // @ts-ignore
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

/**
 *
 * for details: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 * @param {number} a
 * @param {number} b
 */
export function formatBytes(a: number, b = 2) {
  /* eslint-disable prefer-template */
  /* eslint-disable no-restricted-properties */
  if (a === 0) return '0 Bytes';

  const c = 1024;

  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const f = Math.floor(Math.log(a) / Math.log(c));

  return parseFloat((a / c ** f).toFixed(b)) + ' ' + e[f];
}

export function mergeResourceSizeForFrontend(resource) {
  const mergedResourceSize = {};

  const isLink = resource.urlType !== 'upload';
  const resourceSize = resource.resourceSize || null;

  if (resourceSize) {
    let size;
    let sizeFormat;

    if (isLink) {
      sizeFormat = resourceSize.sizeUnits?.toUpperCase() || '';

      try {
        size = Number.parseFloat(resourceSize.sizeValue);
      } catch (e) {
        console.error(`sizeValue parsing failed resource id: ${resource.id}`);
      }

      if (Number.isNaN(size)) {
        size = undefined;
      }
    } else {
      size = resource.size;
    }

    mergedResourceSize.size = size;
    mergedResourceSize.sizeFormat = sizeFormat;
  }

  return mergedResourceSize;
}
