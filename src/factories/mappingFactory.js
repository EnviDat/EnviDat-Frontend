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
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_CUSTOMFIELDS_ENTRY,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_GEO_SPATIAL,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_INFO_DATES,
  EDITMETADATA_DATA_LICENSE,
  EDITMETADATA_DATA_RESOURCE,
  EDITMETADATA_DATA_RESOURCE_SIZE,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_DATA_RESTRICTED,
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS, METADATA_MAIN_HEADER,
  USER_OBJECT,
} from '@/factories/eventBus';

import { UPDATE_METADATA_EDITING, USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';

import { enhanceElementsWithStrategyEvents, SELECT_EDITING_RESOURCE_PROPERTY } from '@/factories/strategyFactory';

import { md5Hash } from '@/factories/stringFactory';
import {
  DATE_PROPERTY_CREATED_TYPE,
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
  EDIT_METADATA_AUTHORS_LABEL,
  EDIT_METADATA_DATALICENSE_LABEL,
  EDIT_METADATA_DOI_LABEL,
  EDIT_METADATA_ORGANIZATION_LABEL,
  EDIT_METADATA_PUBLICATION_YEAR_LABEL,
  EDIT_METADATA_PUBLISHER_LABEL,
  EDIT_METADATA_TITLE_LABEL,
  EDIT_METADATA_URL_LABEL,
  METADATA_AUTHORS_PROPERTY,
  METADATA_CONTACT_EMAIL,
  METADATA_DATALICENSE_PROPERTY,
  METADATA_DEPRECATED_RESOURCES_PROPERTY,
  METADATA_DOI_PROPERTY,
  METADATA_ORGANIZATION_PROPERTY,
  METADATA_PUBLICATION_YEAR_PROPERTY,
  METADATA_PUBLISHER_PROPERTY,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';

import { createAuthor } from '@/factories/authorFactory';
import { enhanceKeywords } from '@/factories/keywordsFactory';
import categoryCards from '@/store/categoryCards';
import { createLocation } from '@/factories/geoFactory';
import { getMetadataVisibilityState } from '@/factories/publicationFactory';
import { formatDate } from '@/factories/dateFactory';

/**
 * Json conversion rules from frontend to backend and vise versa
 * https://stackoverflow.com/questions/50081462/javascript-how-to-map-a-backend-entity-to-a-frontend-entity-and-the-opposite
 */
const JSONFrontendBackendRules = {
  [METADATA_MAIN_HEADER]: [
    [METADATA_TITLE_PROPERTY,'title'],
    [METADATA_CONTACT_EMAIL,'maintainer.email'],
    ['firstName','maintainer.given_name'],
    ['lastName','maintainer.name'],
    ['doi','doi'],
    ['tags','tags'],
    ['authors','author'],
    ['organization','organization.name'],
    ['organizationTooltip','organization.title'],
    ['spatialInfo','spatial_info'],
    ['created','metadata_created'],
    ['modified','metadata_modified'],
    ['state','state'],
    ['private','private'],
  ],
  [EDITMETADATA_MAIN_HEADER]: [
    [METADATA_TITLE_PROPERTY,'title'],
    [METADATA_URL_PROPERTY,'name'],
    [METADATA_CONTACT_EMAIL,'maintainer.email'],
    ['contactFirstName','maintainer.given_name'],
    ['contactLastName','maintainer.name'],
    ['license','license_title'],
  ],
  [EDITMETADATA_MAIN_DESCRIPTION]: [
    ['description','notes'],
  ],
  [EDITMETADATA_KEYWORDS]: [
    ['keywords','tags'],
  ],
  [EDITMETADATA_AUTHOR]: [
    ['firstName','given_name'],
    ['lastName','name'],
    ['email','email'],
    ['dataCredit','data_credit'],
    ['identifierType','identifier_scheme'],
    ['identifier','identifier'],
    ['affiliation','affiliation'],
  ],
  [EDITMETADATA_AUTHOR_LIST]: [
    ['authors','author'],
  ],
  [EDITMETADATA_DATA_RESOURCE]: [
    ['metadataId','package_id'],
    ['cacheLastUpdated','cache_last_updated'],
    ['cacheUrl','cache_url'],
    ['created','created'],
    ['description','description'],
    ['doi','doi'],
    ['format','format'],
    ['hash','hash'],
    ['id','id'],
    ['lastModified','last_modified'],
    ['mimetype','mimetype'],
    ['mimetypeInner','mimetype_inner'],
    ['metadataModified','metadata_modified'],
    ['multipartName','multipart_name'],
    ['name','name'],
    ['packageId','package_id'],
    ['position','position'],
    ['restricted','restricted'],
    ['resourceSize','resource_size'],
    ['resourceType','resource_type'],
    ['size','size'],
    ['state','state'],
    ['url','url'],
    ['urlType','url_type'],
  ],
  [EDITMETADATA_DATA_RESOURCE_SIZE]: [
    ['sizeValue','size_value'],
    ['sizeUnits','size_units'],
  ],
  [EDITMETADATA_DATA_RESTRICTED]: [
    ['allowedUsers','allowed_users'],
    ['level','level'],
    ['sharedSecret','shared_secret'],
  ],
  [EDITMETADATA_DATA_RESOURCES]: [
    ['resources','resources'],
  ],
  [EDITMETADATA_DATA_INFO]: [
    ['dates','date'],
  ],
  [EDITMETADATA_DATA_LICENSE]: [
    [METADATA_DATALICENSE_PROPERTY,'license_id'],
    ['dataLicenseTitle','license_title'],
    ['dataLicenseUrl','license_url'],
  ],
  [EDITMETADATA_DATA_INFO_DATES]: [
    [DATE_PROPERTY_DATE_TYPE, 'date_type'],
    [DATE_PROPERTY_START_DATE, 'date'],
    [DATE_PROPERTY_END_DATE, 'end_date'],
  ],
  [EDITMETADATA_DATA_GEO]: [
    ['location.geoJSON','spatial'],
  ],
  [EDITMETADATA_DATA_GEO_SPATIAL]: [
    ['type','type'],
    ['coordinates','coordinates'],
  ],
  [EDITMETADATA_RELATED_PUBLICATIONS]: [
    ['relatedPublicationsText', 'related_publications'],
  ],
  [EDITMETADATA_RELATED_DATASETS]: [
    ['relatedDatasetsText', 'related_datasets'],
  ],
  [EDITMETADATA_CUSTOMFIELDS]: [
    ['customFields', 'extras'],
  ],
  [EDITMETADATA_CUSTOMFIELDS_ENTRY]: [
    ['fieldName', 'key'],
    ['content', 'value'],
  ],
  [EDITMETADATA_ORGANIZATION]: [
    ['organizationId', 'organization.id'],
  ],
  [EDITMETADATA_PUBLICATION_INFO]: [
    ['publicationState','publication_state'],
    ['doi','doi'],
    ['publisher','publication.publisher'],
    ['publicationYear','publication.publication_year'],
    ['version', 'version'],
    ['datasetId', 'id'],
  ],
  [EDITMETADATA_FUNDING_INFO]: [
    ['funders','funding'],
  ],
  [USER_OBJECT]: [
    ['id','id'],
    ['name','name'],
    ['fullName','fullname'],
    ['email','email'],
    ['apikey','apikey'],
    ['resetKey','reset_key'],
    ['created','created'],
    ['about','about'],
    ['activityStreamsEmailNotifications','activity_streams_email_notifications'],
    ['sysadmin','sysadmin'],
    ['state','state'],
    ['imageUrl','image_url'],
    ['displayName','display_name'],
    ['emailHash','email_hash'],
    ['numberCreatedPackages','number_created_packages'],
    ['pluginExtras','plugin_extras'],
    ['imageDisplayUrl','image_display_url'],
  ],
};

export function unpackDeprecatedResources(customFields) {
  let unpackedResourceIds = [];

  if (customFields?.length > 0) {
    const customFieldEntry = customFields.filter((entry) => entry?.fieldName === METADATA_DEPRECATED_RESOURCES_PROPERTY)[0];
    const stringResourceIds = customFieldEntry?.content || '[]';
    unpackedResourceIds = JSON.parse(stringResourceIds);
  }

  return unpackedResourceIds;
}

export function markResourceDeprecated(resourceId, deprecated, customFields)  {

  let deprecatedResources = unpackDeprecatedResources(customFields);

  if (deprecated) {
    deprecatedResources.push(resourceId);
  } else {
    deprecatedResources = deprecatedResources.filter(i => i !== resourceId);
  }

  if (customFields.length <= 0) {
    customFields.push({
      fieldName: METADATA_DEPRECATED_RESOURCES_PROPERTY,
      content: JSON.stringify(deprecatedResources),
    });
  } else {
    const deprecatedResourcesEntry = customFields.filter((entry) => entry?.fieldName === METADATA_DEPRECATED_RESOURCES_PROPERTY)[0];
    deprecatedResourcesEntry.content = JSON.stringify(deprecatedResources);
  }

  return customFields;
}

export function deprecatedResourceChanged(resourceId, isDeprecated, customFields){
  const deprecatedResources = unpackDeprecatedResources(customFields);

  const isDeprecatedOnServer = deprecatedResources?.includes(resourceId);
  const isDeprecatedLocally = isDeprecated === true;
  return isDeprecatedLocally !== isDeprecatedOnServer;
}


export function convertJSONArray(array, recursive) {
  const parsedArray = [];

  for (let i = 0; i < array.length; i++) {
    const entry = array[i];
    let parsedValue = JSON.parse(entry);

    if (recursive) {
      if (parsedValue instanceof Array) {
        convertJSONArray(parsedValue, recursive);
      } else if (typeof parsedValue === 'object') {
        // eslint-disable-next-line no-use-before-define
        parsedValue = convertJSON(parsedValue, false, recursive);
      }
    }

    parsedArray.push(parsedValue);
  }

  return parsedArray;
}

const jsonStartRegex = /^\s*(\{|\[)/;

export function convertJSON(data, stringify, recursive = false) {
  const properties = Object.keys(data);
  const flatObj = {};

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    let value = data[prop];

    if (stringify) {
      if (value instanceof Array) {
        value = JSON.stringify(value);

      } else if (typeof value === 'object') {
        if (recursive) {
          value = convertJSON(value, stringify, recursive);
        } else {
          value = JSON.stringify(value);
        }
      }
    } else {

      // eslint-disable-next-line no-lonely-if
      if (typeof value === 'string' && jsonStartRegex.test(value)) {
        try {
          const parsedValue = JSON.parse(value);
          if (parsedValue && typeof parsedValue === 'object') {
            value = parsedValue;
          }
        } catch (e) {

          if (import.meta.env?.MODE === 'development') {
            console.error(`Json parse error on property: ${prop} with value: ${value} had error: ${e}`);
          }
        }
      }

      if (recursive && value instanceof Array) {
        value = convertJSONArray(value, recursive);
      }

      if (recursive && typeof value === 'object') {
        value = convertJSON(value, stringify, recursive);
      }

    }

    flatObj[prop] = value;
  }

  return flatObj;
}



/**
 * Code from https://stackoverflow.com/questions/54246477/how-to-convert-camelcase-to-snake-case-in-javascript
 * @param {String} inputString camelCaseString
 * @returns {String} snake_case_string
 */
export function toSnakeCase(inputString) {
  return inputString.split('').map((character) => {
    if (character === character.toUpperCase() && character !== '_') {
      return `_${character.toLowerCase()}`;
    }

    return character;
  }).join('');
}

/**
 * Code from https://stackoverflow.com/a/61375162/2733509
 * @param {String} snakeCaseString
 * @returns {String} camelCaseString
 */
// eslint-disable-next-line camelcase
export function toCamelCase(snakeCaseString) {
  return snakeCaseString
      // .toLowerCase()
      .replace(/([-_][a-z])/g, group => group
          .toUpperCase()
          //        .replace('-', '')
          .replace('_', ''));
}

export function getObjectInOtherCase(fromCaseObject, caseConversionFunc) {
  const properties = Object.keys(fromCaseObject);
  const toCaseObject = {};

  for (let i = 0; i < properties.length; i++) {
    const fromCaseProp = properties[i];
    const otherCaseProp = caseConversionFunc(fromCaseProp);

    let value = fromCaseObject[fromCaseProp];

    if (value) {
      if (value instanceof Array) {
        // eslint-disable-next-line no-use-before-define
        value = getArrayInOtherCase(value, caseConversionFunc);
      } else if (typeof value === 'object') {
        value = getObjectInOtherCase(value, caseConversionFunc);
      }
    }

    toCaseObject[otherCaseProp] = value;
  }

  return toCaseObject;
}

export function getArrayInOtherCase(fromCaseArray, caseConversionFunc) {
  if (fromCaseArray.length <= 0 || typeof fromCaseArray[0] !== 'object') {
    return fromCaseArray;
  }

  const otherCaseArray = [];
  for (let i = 0; i < fromCaseArray.length; i++) {
    let arrayValue = fromCaseArray[i];

    if (arrayValue) {
      if (arrayValue instanceof Array) {
        arrayValue = getArrayInOtherCase(arrayValue, caseConversionFunc);
      } else if (typeof arrayValue === 'object') {
        // eslint-disable-next-line no-use-before-define
        arrayValue = getObjectInOtherCase(arrayValue, caseConversionFunc);
      }
    }

    otherCaseArray[i] = arrayValue;
  }

  return otherCaseArray;
}

function convertPut(entity, property, value) {
  const path = property.split('.');
  const key = path.pop();

  const o = path.reduce((entry, prop) => {
    // if (!entry.hasOwnProperty(prop)) {
    if (!entry[prop]) {
      entry[prop] = {};
    }
    return entry[prop];
  }, entity);

  o[key] = value;

  return entity;
}

function convertGet(entity, property) {
  return property.split('.').reduce((entry, key) => 
    // Check if entry is an object and the key exists in the entry
     (entry && typeof entry === 'object' && key in entry) ? entry[key] : undefined
  , entity);
}

export function convertToBackendJSONWithRules(rules, data) {
  if (!rules) {
    return null;
  }

  let backendJson = {};

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    try {
      const value = convertGet(data, rule[0]);
      convertPut(backendJson, rule[1], value);
    } catch (e) {
      console.error(i);
      console.error(rule);
      console.error(e);
    }
  }
  // rules.forEach(rule => convertPut(backendJson, rule[1], convertGet(data, rule[0])));

  backendJson = getObjectInOtherCase(backendJson, toSnakeCase);
  return backendJson;
}

export function convertToFrontendJSONWithRules(rules, data) {
  if (!rules) {
    return null;
  }

  let frontendJson = {};

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    try {
      const value = convertGet(data, rule[1]);
      convertPut(frontendJson, rule[0], value);
    } catch (e) {
      console.error(i);
      console.error(rule);
      console.error(e);
    }
  }
  // rules.forEach(rule => convertPut(frontendJson, rule[0], convertGet(data, rule[1])));

  frontendJson = getObjectInOtherCase(frontendJson, toCamelCase);
  return frontendJson;
}

export function getBackendJSONForStep(stepKey, data) {
  const rules = JSONFrontendBackendRules[stepKey];

  return convertToBackendJSONWithRules(rules, data);
}

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
  }
}

export function cleanListForBackend(elementList, mappingKey) {

  const cleanedElements = [];
  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];
    let cleaned = getBackendJSONForStep(mappingKey, element);

    if (mappingKey === EDITMETADATA_DATA_RESOURCE) {
      cleaned = stringifyResourceForBackend(cleaned);
    }

    cleanedElements.push(cleaned);
  }

  return cleanedElements;
}

export function cleanListForFrontend(elementList, mappingKey) {

  const cleanedElements = [];
  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];
    const cleaned = getFrontendJSONForStep(mappingKey, element);
    cleanedElements.push(cleaned);
  }

  return cleanedElements;
}

export function cleanResourceForFrontend(resource) {

  let resSize = resource.resourceSize;

  if (typeof resSize === 'string') {
    try {
      resSize = JSON.parse(resSize);
    } catch (e) {
      console.error(`resourceSize parsing failed (fallback used!) resource id: ${resource.id}`);
      resSize = { size_value: '', size_units: '' };
    }
  }

  const cleanedResSize = getFrontendJSONForStep(EDITMETADATA_DATA_RESOURCE_SIZE, resSize);

  let restricted = resource.restricted;

  if (typeof restricted === 'string') {
    try {
      restricted = JSON.parse(restricted);
    } catch (e) {
      console.error(`restricted parsing failed (fallback used!) resource id: ${resource.id}`);
      restricted = { allowed_users: '', level: 'public', shared_secret: '' };
    }
  }

  const cleanedRestricted = getFrontendJSONForStep(EDITMETADATA_DATA_RESTRICTED, restricted);
  
  return {
    ...resource,
    resourceSize: cleanedResSize,
    restricted: cleanedRestricted,
  }
}

export const metadataPublishedReadOnlyFields = [
  // EditMetadataHeader
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
  // EditAuthorList
  METADATA_AUTHORS_PROPERTY,
  // EditPublicationInfo
  METADATA_ORGANIZATION_PROPERTY,
  METADATA_PUBLICATION_YEAR_PROPERTY,
  METADATA_PUBLISHER_PROPERTY,
  METADATA_DOI_PROPERTY,
  METADATA_DATALICENSE_PROPERTY,
];

export const readablePublishedReadOnlyFields = {
  [METADATA_TITLE_PROPERTY]: EDIT_METADATA_TITLE_LABEL,
  [METADATA_URL_PROPERTY]: EDIT_METADATA_URL_LABEL,
  [METADATA_ORGANIZATION_PROPERTY]: EDIT_METADATA_ORGANIZATION_LABEL,
  [METADATA_AUTHORS_PROPERTY]: EDIT_METADATA_AUTHORS_LABEL,
  [METADATA_DOI_PROPERTY]: EDIT_METADATA_DOI_LABEL,
  [METADATA_PUBLISHER_PROPERTY]: EDIT_METADATA_PUBLISHER_LABEL,
  [METADATA_PUBLICATION_YEAR_PROPERTY]: EDIT_METADATA_PUBLICATION_YEAR_LABEL,
  [METADATA_DATALICENSE_PROPERTY]: EDIT_METADATA_DATALICENSE_LABEL,
};

const readOnlyMappingRules = [
  {
    triggerRule: ['published'],
    explanation: 'This field is "readonly" because the dataset is already published.',
    readOnlyFields: metadataPublishedReadOnlyFields,
  },
/*
  {
    triggerRule: ['draft'],
    explanation: 'This is "readonly" because the dataset is still a draft.',
    readOnlyFields: [
      'resources',
    ],
  },
*/
/*
  {
    triggerRule: USER_ROLE_ADMIN,
    readOnlyFields: [],
  },
*/
];

export function getReadOnlyFieldsObject(trigger) {
  if (!trigger) {
    return null;
  }

  const lowCaseTrigger = trigger?.toLowerCase() || '';

  for (let i = 0; i < readOnlyMappingRules.length; i++) {
    const mappingObj = readOnlyMappingRules[i];

    if (mappingObj.triggerRule.includes(lowCaseTrigger)) {
      return mappingObj;
    }
  }

  return null;
}

function commitEditingData(commit, eventName, data) {
  if(!commit) {
    return;
  }

  commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
    {
      object: eventName,
      data,
    },
    { root: true },
  );
}

function mapCustomFields(fields, frontendToBackend = true) {
  const entries = [];

  if (!fields) {
    return entries;
  }

  for (let i = 0; i < fields.length; i++) {
    let mappedEntry = null;
    if (frontendToBackend) {
      mappedEntry = getBackendJSONForStep(EDITMETADATA_CUSTOMFIELDS_ENTRY, fields[i]);
    } else {
      mappedEntry = getFrontendJSONForStep(EDITMETADATA_CUSTOMFIELDS_ENTRY, fields[i]);
    }
    entries.push(mappedEntry);
  }

  return entries;
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

function populateEditingMain(commit, backendJSON) {

  const dataObject = {};

  let stepKey = EDITMETADATA_MAIN_HEADER;
  const headerData = getFrontendJSONForStep(stepKey, backendJSON);
  // the commiting of the EDITMETADATA_MAIN_HEADER is done later on,
  // with additional data from other "steps"

  dataObject.headerData = headerData;

  stepKey = EDITMETADATA_MAIN_DESCRIPTION;
  const descriptionData = getFrontendJSONForStep(stepKey, backendJSON);

  commitEditingData(commit, stepKey, descriptionData);
  dataObject.descriptionData = descriptionData;

  stepKey = EDITMETADATA_KEYWORDS;
  const keywordsData = getFrontendJSONForStep(stepKey, backendJSON);
  const enhancedDatasets = enhanceKeywords(keywordsData, categoryCards);

  const enhancedKeywords = {
    ...enhancedDatasets,
    metadataCardTitle: headerData.metadataTitle, // only used for showing a the preview MetadataCard
    metadataCardSubtitle: descriptionData.description, // only used for showing a the preview MetadataCard
  }

  commitEditingData(commit, stepKey, enhancedKeywords);
  dataObject.keywordsData = keywordsData;

  return dataObject;
}

export function getFrontendDates(backendDates) {
  let dates = backendDates;
  if(typeof backendDates === 'string') {
    dates = JSON.parse(backendDates);
  }

  return formatDatesForFrontend(dates);
}

function populateEditingAuthors(commit, backendJSON) {

  const dataObject = {};

  const stepKey = EDITMETADATA_AUTHOR_LIST;
  const authors = []

  backendJSON.author.forEach((bAuthor) => {
    const author = getFrontendJSONForStep(EDITMETADATA_AUTHOR, bAuthor);
    const fAuthor = createAuthor(author)
    authors.push(fAuthor);
  })

  commitEditingData(commit, stepKey, { authors });
  dataObject.authors = authors;

  return dataObject;
}

function populateEditingDataInfo(commit, backendJSON) {

  const dataObject = {};

  // Stepper 2: Data Resources, Info, Location
  // const resources = createResources(metadataRecord).resources;

  let stepKey = EDITMETADATA_DATA_INFO;
  const bDates = backendJSON.date;
  const dateInfoData = getFrontendJSONForStep(stepKey, backendJSON);

  // special case here to use the backend structure json directly to format the entries
  // this is done for consistency. When calling getFrontendJSONForStep() the dateInfoData.dates
  // are already in camelCase and not snakeCase anymore, so for formatDatesForFrontend() the JSONFrontendBackendRules
  // would have to be only in camelCase, which wouldn't fit the rest of the structure
  // and therefore a special case implementation would also be necessary in the creationWorkflow when getting
  // the information from the localstorage. Since here is already a special case implementation, it's better to do it
  // here and keep the JSONFrontendBackendRules consistent!
  dateInfoData.dates = formatDatesForFrontend(bDates);

  commitEditingData(commit, stepKey, dateInfoData);
  dataObject.dataInfo = dateInfoData;

  stepKey = EDITMETADATA_DATA_LICENSE;
  const dataLicenseInfo = getFrontendJSONForStep(stepKey, backendJSON);

  commitEditingData(commit, stepKey, dataLicenseInfo);
  dataObject.dataLicenseInfo = dataLicenseInfo;

  stepKey = EDITMETADATA_DATA_GEO;
  const geoData = getFrontendJSONForStep(stepKey, backendJSON);

  const location = createLocation({
    id: backendJSON.id,
    name: backendJSON.name,
    title: backendJSON.title,
    // don't pass location directly as the mapping to the fontend location only contains the geoJSON
    spatial: geoData.location.geoJSON,
  });

  commitEditingData(commit, stepKey, {
    location,
  });
  dataObject.location = location;

  return dataObject;
}

function populateEditingResources(commit, backendJSON, dataLicenseInfo, customFields) {

  const dataObject = {};

  // Stepper 2: Data Resources, Info, Location
  // const resources = createResources(metadataRecord).resources;

  const stepKey = EDITMETADATA_DATA_RESOURCES;
  const resourceData = getFrontendJSONForStep(stepKey, backendJSON);
  const resources = resourceData.resources;

  resourceData.dataLicenseTitle = dataLicenseInfo.dataLicenseTitle;
  resourceData.dataLicenseUrl = dataLicenseInfo.dataLicenseUrl;

  const deprecatedResources = unpackDeprecatedResources(customFields);

  for (let i = 0; i < resources.length; i++) {
    resources[i] = cleanResourceForFrontend(resources[i]);

    // HACK: Due to the lack of proper mapping in the frontend
    // and the inability to change the schema in the backend
    // the mapping of the deprecated field is performed here in a very inefficient and unmaintainable way
    // The counterpart is found in editActions -> METADATA_EDITING_PATCH_RESOURCE
    // change this ASAP (move to centralised mapping, or simply adjust backend)!
    resources[i].deprecated = deprecatedResources?.includes(resources[i].id);
  }

  enhanceElementsWithStrategyEvents(
    resources,
    SELECT_EDITING_RESOURCE_PROPERTY,
    true,
  );

  commitEditingData(commit, stepKey, resourceData);
  dataObject.resourceData = resourceData;
  
  return dataObject;
}

function populateEditingRelatedResearch(commit, backendJSON) {

  const dataObject = {};

  let stepKey = EDITMETADATA_RELATED_PUBLICATIONS;
  const rPublicationData = getFrontendJSONForStep(stepKey, backendJSON);

  commitEditingData(commit, stepKey, rPublicationData);
  dataObject.relatedPublicationData = rPublicationData;

  stepKey = EDITMETADATA_RELATED_DATASETS;
  const rDatasetsData = getFrontendJSONForStep(stepKey, backendJSON);

  commitEditingData(commit, stepKey, rDatasetsData);
  dataObject.relatedDatasetsData = rDatasetsData;

  stepKey = EDITMETADATA_CUSTOMFIELDS;
  const customFieldsData = getFrontendJSONForStep(stepKey, backendJSON);
  customFieldsData.customFields = mapCustomFields(customFieldsData.customFields, false);

  commitEditingData(commit, stepKey, customFieldsData);
  dataObject.customFieldsData = customFieldsData;

  return dataObject;
}

function populateEditingPublicationInfo(commit, metadataRecord, backendJSON) {

  const dataObject = {};

  let stepKey = EDITMETADATA_PUBLICATION_INFO;
  const publicationData = getFrontendJSONForStep(stepKey, backendJSON);
  publicationData.visibilityState = getMetadataVisibilityState(metadataRecord);

  commitEditingData(commit, stepKey, publicationData);
  dataObject.publicationData = publicationData;

  stepKey = EDITMETADATA_FUNDING_INFO;
  const fundingData = getFrontendJSONForStep(stepKey, backendJSON);

  commitEditingData(commit, stepKey, fundingData);
  dataObject.fundingData = fundingData;

  stepKey = EDITMETADATA_ORGANIZATION;
  const organizationData = getFrontendJSONForStep(stepKey, backendJSON);

  commitEditingData(commit, stepKey, organizationData);
  dataObject.organizationData = organizationData;

  return dataObject;
}

export function populateEditingComponents(commit, metadataRecord) {

  const backendJSON = convertJSON(metadataRecord, false);

  const { headerData, keywordsData } = populateEditingMain(commit, backendJSON);

  const { authors } = populateEditingAuthors(commit, backendJSON);

  const { dataLicenseInfo } = populateEditingDataInfo(commit, backendJSON);

  const { customFieldsData } = populateEditingRelatedResearch(commit, backendJSON);

  populateEditingResources(commit, backendJSON, dataLicenseInfo, customFieldsData.customFields);


  const { publicationData } = populateEditingPublicationInfo(commit, metadataRecord, backendJSON);

  // enhanced Header for the preview infos
  const stepKey = EDITMETADATA_MAIN_HEADER;

  const organization = backendJSON.organization.name;
  const organizationTooltip = backendJSON.organization.title;

  const enhanceHeader = {
    ...headerData,
    keywords: keywordsData.keywords,
    authors,
    organization,
    organizationTooltip,
    doi: publicationData.doi,
  };

  commitEditingData(commit, stepKey, enhanceHeader);
}

function mapDatesForBackend(datesArray, initializeDefaults = true) {

  if (!Array.isArray(datesArray) || datesArray.length <= 0 && initializeDefaults) {
    const entry = getBackendJSONForStep(EDITMETADATA_DATA_INFO_DATES, {
      [DATE_PROPERTY_DATE_TYPE]: DATE_PROPERTY_CREATED_TYPE,
      [DATE_PROPERTY_START_DATE]: '',
      [DATE_PROPERTY_END_DATE]: '',
    });

    return [entry];
  }

  const mappedDates = [];

  for (let i = 0; i < datesArray.length; i++) {
    const dateEntry = datesArray[i];

    const entry = getBackendJSONForStep(EDITMETADATA_DATA_INFO_DATES, dateEntry);
    mappedDates.push(entry);
  }

  return mappedDates;
}


const dataNeedsStringify = [
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_PUBLICATION_INFO, // still needed without funding info?
  EDITMETADATA_FUNDING_INFO,
];

export function mapBackendToFrontend(stepKey, backendData) {

  // dataNeedsStringify.includes(stepKey)
  const backendJSON = convertJSON(backendData, false);

  if (stepKey === EDITMETADATA_DATA_RESOURCES) {
    backendJSON.resources = cleanListForFrontend(backendJSON.resources, EDITMETADATA_DATA_RESOURCE);
  } else if (stepKey === EDITMETADATA_AUTHOR_LIST) {
    backendJSON.author = cleanListForFrontend(backendJSON.author, EDITMETADATA_AUTHOR);
  } else if (stepKey === EDITMETADATA_DATA_INFO) {
    backendJSON.date = formatDatesForFrontend(backendJSON.date);
  } else if (stepKey === EDITMETADATA_CUSTOMFIELDS) {
    backendJSON.extras = mapCustomFields(backendJSON.extras, false);
  }

  return getFrontendJSONForStep(stepKey, backendJSON);
}

export function mapFrontendToBackend(stepKey, frontendData, initializeDefaults = true) {

  // create a local copy to avoid mutation of vuex store objects / properties
  const localData = { ...frontendData };

  if (stepKey === EDITMETADATA_DATA_RESOURCES) {
    localData.resources = cleanListForBackend(localData.resources, EDITMETADATA_DATA_RESOURCE);
  } else if (stepKey === EDITMETADATA_AUTHOR_LIST) {
    localData.authors = cleanListForBackend(localData.authors, EDITMETADATA_AUTHOR);
  } else if (stepKey === EDITMETADATA_DATA_INFO) {
    localData.dates = mapDatesForBackend(localData.dates, initializeDefaults);
  } else if (stepKey === EDITMETADATA_CUSTOMFIELDS) {
    localData.customFields = mapCustomFields(localData.customFields);
  }

  let backendData = getBackendJSONForStep(stepKey, localData);

  if (dataNeedsStringify.includes(stepKey)) {
    backendData = convertJSON(backendData, true);
  }

  return backendData;
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
export const ckanDateTimeFormat = 'yyyy-MM-dd\'T\'HH:mm:ss.SSSSSS';

/**
 *
 * @param {Date} date
 * @returns {string|null}
 */
export function formatDateTimeToCKANFormat(date) {

  if (!date) {
    return null;
  }

  return format(date, ckanDateTimeFormat);
}

/**
 *
 * @param {string} dateString
 * @returns {string|null}
 */
export function parseDateStringToReadableFormat(dateString) {
  if (!dateString) {
    return null;
  }

  const parsedDate = parse(dateString, ckanDateTimeFormat, new Date());

  if (!isValid(parsedDate)) {
    return null;
  }

  return formatDate(parsedDate);
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

