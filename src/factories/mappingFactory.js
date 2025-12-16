/**
 * function factory for mapping backend and frontend data structures
 *
 * @summary functions for json conversion
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-11-11 15:53:30
 * Last modified  : 2021-11-11 15:47:25
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { format, isValid, parse } from 'date-fns';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_GEO_SPATIAL,
  EDITMETADATA_DATA_INFO_DATES,
  EDITMETADATA_DATA_RESOURCE,
  EDITMETADATA_DATA_RESTRICTED,
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  METADATA_MAIN_HEADER,
  USER_OBJECT,
} from '@/factories/eventBus';

import { md5Hash } from '@/factories/stringFactory';
import {
  DATE_PROPERTY_CREATED_TYPE,
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
  METADATA_CONTACT_EMAIL,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';
import { formatDate } from '@/factories/dateFactory';
import { convertJSON, convertToFrontendJSONWithRules } from '@/factories/convertJSON';

/**
 * Json conversion rules from frontend to backend and vise versa
 * https://stackoverflow.com/questions/50081462/javascript-how-to-map-a-backend-entity-to-a-frontend-entity-and-the-opposite
 */
const JSONFrontendBackendRules = {
  [METADATA_MAIN_HEADER]: [
    [METADATA_TITLE_PROPERTY, 'title'],
    [METADATA_CONTACT_EMAIL, 'maintainer.email'],
    ['firstName', 'maintainer.given_name'],
    ['lastName', 'maintainer.name'],
    ['doi', 'doi'],
    ['tags', 'tags'],
    ['authors', 'author'],
    ['organization', 'organization.name'],
    ['organizationTooltip', 'organization.title'],
    ['spatialInfo', 'spatial_info'],
    ['created', 'metadata_created'],
    ['modified', 'metadata_modified'],
    ['state', 'state'],
    ['private', 'private'],
  ],
  [EDITMETADATA_MAIN_HEADER]: [
    [METADATA_TITLE_PROPERTY, 'title'],
    [METADATA_URL_PROPERTY, 'name'],
    [METADATA_CONTACT_EMAIL, 'maintainer.email'],
    ['contactFirstName', 'maintainer.given_name'],
    ['contactLastName', 'maintainer.name'],
    ['license', 'license_title'],
  ],
  [EDITMETADATA_MAIN_DESCRIPTION]: [['description', 'notes']],
  [EDITMETADATA_AUTHOR_LIST]: [['authors', 'author']],
  [EDITMETADATA_DATA_RESOURCE]: [
    ['metadataId', 'package_id'],
    ['cacheLastUpdated', 'cache_last_updated'],
    ['cacheUrl', 'cache_url'],
    ['created', 'created'],
    ['description', 'description'],
    ['doi', 'doi'],
    ['format', 'format'],
    ['hash', 'hash'],
    ['id', 'id'],
    ['lastModified', 'last_modified'],
    ['mimetype', 'mimetype'],
    ['mimetypeInner', 'mimetype_inner'],
    ['metadataModified', 'metadata_modified'],
    ['multipartName', 'multipart_name'],
    ['name', 'name'],
    ['packageId', 'package_id'],
    ['position', 'position'],
    ['restricted', 'restricted'],
    ['resourceSize', 'resource_size'],
    ['resourceType', 'resource_type'],
    ['size', 'size'],
    ['state', 'state'],
    ['url', 'url'],
    ['urlType', 'url_type'],
  ],
  [EDITMETADATA_DATA_RESTRICTED]: [
    ['allowedUsers', 'allowed_users'],
    ['level', 'level'],
    ['sharedSecret', 'shared_secret'],
  ],
  [EDITMETADATA_DATA_INFO_DATES]: [
    [DATE_PROPERTY_DATE_TYPE, 'date_type'],
    [DATE_PROPERTY_START_DATE, 'date'],
    [DATE_PROPERTY_END_DATE, 'end_date'],
  ],
  [EDITMETADATA_DATA_GEO_SPATIAL]: [
    ['type', 'type'],
    ['coordinates', 'coordinates'],
  ],
  [EDITMETADATA_ORGANIZATION]: [['organizationId', 'organization.id']],
  [EDITMETADATA_PUBLICATION_INFO]: [
    ['publicationState', 'publication_state'],
    ['doi', 'doi'],
    ['publisher', 'publication.publisher'],
    ['publicationYear', 'publication.publication_year'],
    ['version', 'version'],
    ['datasetId', 'id'],
  ],
  [EDITMETADATA_FUNDING_INFO]: [['funders', 'funding']],
  [USER_OBJECT]: [
    ['id', 'id'],
    ['name', 'name'],
    ['fullName', 'fullname'],
    ['email', 'email'],
    ['apikey', 'apikey'],
    ['resetKey', 'reset_key'],
    ['created', 'created'],
    ['about', 'about'],
    ['activityStreamsEmailNotifications', 'activity_streams_email_notifications'],
    ['sysadmin', 'sysadmin'],
    ['state', 'state'],
    ['imageUrl', 'image_url'],
    ['displayName', 'display_name'],
    ['emailHash', 'email_hash'],
    ['numberCreatedPackages', 'number_created_packages'],
    ['pluginExtras', 'plugin_extras'],
    ['imageDisplayUrl', 'image_display_url'],
  ],
};

export function getFrontendJSONForStep(stepKey, data) {
  const rules = JSONFrontendBackendRules[stepKey];

  return convertToFrontendJSONWithRules(rules, data);
}

export function stringifyResourceForBackend(resource) {
  let resourceSize = resource.resource_size;

  if (typeof resourceSize === 'object') {
    try {
      resourceSize = JSON.stringify({
        size_value: resourceSize.size_value?.toString() || '',
        size_units: resourceSize.size_units?.toString().toLowerCase() || '',
      });
    } catch (e) {
      console.error(`Tried stringify resourceSize ${e}`);
      resourceSize = JSON.stringify({
        size_value: '',
        size_units: '',
      });
    }
  }

  let restricted = resource.restricted;

  if (typeof restricted === 'object') {
    try {
      restricted = JSON.stringify({
        level: restricted.level?.toString() || 'public',
        allowed_users: restricted.allowed_users?.toString() || '',
        shared_secret: restricted.shared_secret?.toString() || '',
      });
    } catch (e) {
      console.error(`Tried stringify restricted ${e}`);
      restricted = JSON.stringify({
        level: 'public',
        allowed_users: '',
        shared_secret: '',
      });
    }
  }

  return {
    ...resource,
    resource_size: resourceSize,
    restricted,
  };
}

function formatDatesForFrontend(dates) {
  if (!dates) return [];

  const formattedDates = [];

  for (let i = 0; i < dates.length; i++) {
    const dateEntry = dates[i];

    const entry = getFrontendJSONForStep(EDITMETADATA_DATA_INFO_DATES, dateEntry);
    entry.dateType = entry.dateType || DATE_PROPERTY_CREATED_TYPE;
    entry.dateStart = formatDate(entry.dateStart) || '';
    entry.dateEnd = formatDate(entry.dateEnd) || '';

    formattedDates.push(entry);
  }

  return formattedDates;
}

export function getFrontendDates(backendDates) {
  let dates = backendDates;
  if (typeof backendDates === 'string') {
    dates = JSON.parse(backendDates);
  }

  return formatDatesForFrontend(dates);
}

export function mapBackendToFrontend(stepKey, backendData) {
  // dataNeedsStringify.includes(stepKey)
  const backendJSON = convertJSON(backendData, false);

  return getFrontendJSONForStep(stepKey, backendJSON);
}

export const ckanDateFormat = 'yyyy-MM-dd';
export const enviDatDateFormat = 'dd-MM-yyyy';

export function parseDateStringToCKANFormat(dateString) {
  if (!dateString) {
    return null;
  }

  const parsedDate = parse(dateString, enviDatDateFormat, new Date());

  if (!isValid(parsedDate)) {
    return null;
  }

  return format(parsedDate, ckanDateFormat);
}

export function parseDateStringToEnviDatFormat(dateString) {
  if (!dateString) {
    return null;
  }

  const parsedDate = parse(dateString, ckanDateFormat, new Date());

  if (!isValid(parsedDate)) {
    return null;
  }

  return format(parsedDate, enviDatDateFormat);
}

// ex. 2023-02-14T11:00:31.518140
export const ckanDateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS";

/**
 *
 * @param {Date|string} date
 * @returns {string|null}
 */
export function formatDateTimeToCKANFormat(date) {
  if (!date) {
    return null;
  }

  return format(date, ckanDateTimeFormat);
}

export function enhanceUserObject(user) {
  const cleanUser = getFrontendJSONForStep(USER_OBJECT, user);

  const email = cleanUser?.email || null;
  if (email) {
    cleanUser.emailHash = md5Hash(email);
  }

  // only use the fullname from ckan api, because the "name" is not usable to show the users
  const fullName = cleanUser?.fullName || cleanUser?.displayName || '';

  if (fullName) {
    cleanUser.fullName = fullName;
  }

  return cleanUser;
}

export function getMetadataUrlFromTitle(title) {
  let urlName = title?.toLowerCase() || '';
  urlName = urlName.trim().replaceAll(' ', '-');

  urlName = urlName.replaceAll('ä', 'ae');
  urlName = urlName.replaceAll('ö', 'oe');
  urlName = urlName.replaceAll('ü', 'ue');

  if (urlName.length > 80) {
    // only a max of 80 is allowed by the backend for the url
    urlName = urlName.substring(0, 80);
  }

  return urlName;
}
