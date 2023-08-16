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
  EDITMETADATA_RELATED_PUBLICATIONS,
  USER_OBJECT,
} from '@/factories/eventBus';

import {
  UPDATE_METADATA_EDITING,
  USER_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import {
  createLocation,
  enhanceTags,
  formatDate,
  getMetadataVisibilityState,
} from '@/factories/metaDataFactory';

import {
  enhanceElementsWithStrategyEvents,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';

import { md5Hash } from '@/factories/stringFactory';
import {
  DATE_PROPERTY_CREATED_TYPE,
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';

/**
 * Json conversion rules from frontend to backend and vise versa
 * https://stackoverflow.com/questions/50081462/javascript-how-to-map-a-backend-entity-to-a-frontend-entity-and-the-opposite
 */
const JSONFrontendBackendRules = {
  [EDITMETADATA_MAIN_HEADER]: [
    [METADATA_TITLE_PROPERTY,'title'],
    [METADATA_URL_PROPERTY,'name'],
    ['contactEmail','maintainer.email'],
    ['contactGivenName','maintainer.given_name'],
    ['contactSurname','maintainer.name'],
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
/*
    ['affiliations.affiliation1','affiliation'],
    ['affiliations.affiliation2','affiliation_02'],
    ['affiliations.affiliation3','affiliation_03'],
*/
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
    ['publicationState','publication_state'],
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
    ['dataLicenseId','license_id'],
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

          if (import.meta.env.DEV) {
            if (e instanceof SyntaxError) {
              // eslint-disable-next-line no-console
              console.log(`Json parse error on property: ${prop} with value: ${value} had error: ${e}`);
            } else {
              // eslint-disable-next-line no-console
              console.error(`Json parse error on property: ${prop} with value: ${value} had error: ${e}`);
            }
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

function convertPut(entity, property, v) {
  const path = property.split('.');
  const key = path.pop();

  const o = path.reduce((entry, prop) => {
    // if (!entry.hasOwnProperty(prop)) {
    if (!entry[prop]) {
      entry[prop] = {};
    }
    return entry[prop];
  }, entity);

  o[key] = v;

  return entity;
}

function convertGet(entity, property) {
  return property.split('.').reduce( (entry, b) => entry[b], entity);
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
      console.log(i);
      console.log(rule);
      console.error(e);
    }
  }
  // rules.forEach(rule => convertPut(backendJson, rule[1], convertGet(data, rule[0])));

  backendJson = getObjectInOtherCase(backendJson, toSnakeCase);
  return backendJson;
}

function convertToFrontendJSONWithRules(rules, data) {
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
      console.log(i);
      console.log(rule);
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
      console.log(`resourceSize parsing failed (fallback used!) resource id: ${resource.id}`);
      resSize = { size_value: '', size_units: '' };
    }
  }

  const cleanedResSize = getFrontendJSONForStep(EDITMETADATA_DATA_RESOURCE_SIZE, resSize);

  let restricted = resource.restricted;

  if (typeof restricted === 'string') {
    try {
      restricted = JSON.parse(restricted);
    } catch (e) {
      console.log(`restricted parsing failed (fallback used!) resource id: ${resource.id}`);
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


// possible publication states: ['', 'published', 'approved', 'publication pending', 'publication requested']
const readOnlyMappingRules = [
  {
    triggerRule: ['published'],
    explanation: 'This field is "readonly" because the dataset is already published.',
    readOnlyFields: [
      // EditMetadataHeader
      METADATA_TITLE_PROPERTY,
      // EditAuthorList
      'authors',
      // EditPublicationInfo
      'organization',
      'publicationYear',
      'publisher',
      'doi',
      // not implemented yet
      METADATA_URL_PROPERTY,
    ],
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
    triggerRule: 'admin',
    readOnlyFields: [],
  },
*/
];

export function getReadOnlyFieldsObject(trigger) {

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

function populateEditingMain(commit, categoryCards, snakeCaseJSON) {

  const dataObject = {};

  let stepKey = EDITMETADATA_MAIN_HEADER;
  const headerData = getFrontendJSONForStep(stepKey, snakeCaseJSON);
  // the commiting of the EDITMETADATA_MAIN_HEADER is done later on,
  // with additional data from other "steps"

  dataObject.headerData = headerData;

  stepKey = EDITMETADATA_MAIN_DESCRIPTION;
  const descriptionData = getFrontendJSONForStep(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, descriptionData);
  dataObject.descriptionData = descriptionData;

  stepKey = EDITMETADATA_KEYWORDS;
  const enhanceDataset = enhanceTags(snakeCaseJSON, categoryCards);
  const keywordsData = getFrontendJSONForStep(stepKey, enhanceDataset);

  const enhancedKeywords = {
    ...keywordsData,
    metadataCardTitle: headerData.metadataTitle,
    metadataCardSubtitle: descriptionData.description,
  }

  commitEditingData(commit, stepKey, enhancedKeywords);
  dataObject.keywordsData = keywordsData;

  return dataObject;
}

function populateEditingAuthors(commit, snakeCaseJSON) {

  const dataObject = {};

  const stepKey = EDITMETADATA_AUTHOR_LIST;
  // const backendAuthors = getFrontendJSON(stepKey, snakeCaseJSON);

  const authors = []
  snakeCaseJSON.author.forEach((bAuthor) => {
    const author = getFrontendJSONForStep(EDITMETADATA_AUTHOR, bAuthor);

    if (typeof author.dataCredit === 'string') {
      author.dataCredit = [author.dataCredit];
    }

    authors.push(author);
  })

  commitEditingData(commit, stepKey, { authors });
  dataObject.authors = authors;

  return dataObject;
}

function populateEditingDataInfo(commit, snakeCaseJSON) {

  const dataObject = {};

  // Stepper 2: Data Resources, Info, Location
  // const resources = createResources(metadataRecord).resources;

  let stepKey = EDITMETADATA_DATA_INFO;
  const bDates = snakeCaseJSON.date;
  const dateInfoData = getFrontendJSONForStep(stepKey, snakeCaseJSON);

  // special case here to use the backend structure json directly to format the entries
  // this is done for consitency. When calling getFrontendJSONForStep() the dateInfoData.dates
  // are already in camelCase and not snakeCase anymore, so for formatDatesForFrontend() the JSONFrontendBackendRules
  // would have to be only in camelCase, which wouldn't fit the rest of the structure
  // and therefore a special case implementation would also be necessary in the creationWorkflow when getting
  // the information from the localstorage. Since here is already a special case implemenation it's better to do it
  // here and keep the JSONFrontendBackendRules consitent!
  dateInfoData.dates = formatDatesForFrontend(bDates);

  commitEditingData(commit, stepKey, dateInfoData);
  dataObject.dataInfo = dateInfoData;

/*
  stepKey = EDITMETADATA_DATA_LICENSE;
  const dataLicenseInfo = getFrontendJSONForStep(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, dataLicenseInfo);
  dataObject.dataLicenseInfo = dataLicenseInfo;
*/

  stepKey = EDITMETADATA_DATA_GEO;
  const geoData = getFrontendJSONForStep(stepKey, snakeCaseJSON);

  const location = createLocation({
    ...snakeCaseJSON,
    // don't pass location directly as property because it would be
    // returned without the parsing of geo spatial infos
    spatial: geoData.location.geoJSON,
  });

  commitEditingData(commit, stepKey, {
    location,
  });
  dataObject.location = location;

  return dataObject;
}

function populateEditingResources(commit, snakeCaseJSON) {

  const dataObject = {};

  // Stepper 2: Data Resources, Info, Location
  // const resources = createResources(metadataRecord).resources;

  const dataStepKey = EDITMETADATA_DATA_LICENSE;
  const dataLicenseInfo = getFrontendJSONForStep(dataStepKey, snakeCaseJSON);

  commitEditingData(commit, dataStepKey, dataLicenseInfo);
  dataObject.dataLicenseInfo = dataLicenseInfo;

  const stepKey = EDITMETADATA_DATA_RESOURCES;
  const resourceData = getFrontendJSONForStep(stepKey, snakeCaseJSON);
  const resources = resourceData.resources;

  resourceData.license = dataLicenseInfo.license;
  resourceData.licenseUrl = dataLicenseInfo.licenseUrl;

  for (let i = 0; i < resources.length; i++) {
    resources[i] = cleanResourceForFrontend(resources[i]);
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

function populateEditingRelatedResearch(commit, snakeCaseJSON) {

  const dataObject = {};

  let stepKey = EDITMETADATA_RELATED_PUBLICATIONS;
  const rPublicationData = getFrontendJSONForStep(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, rPublicationData);
  dataObject.relatedPublicationData = rPublicationData;

  stepKey = EDITMETADATA_RELATED_DATASETS;
  const rDatasetsData = getFrontendJSONForStep(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, rDatasetsData);
  dataObject.relatedDatasetsData = rDatasetsData;

  stepKey = EDITMETADATA_CUSTOMFIELDS;
  const customFieldsData = getFrontendJSONForStep(stepKey, snakeCaseJSON);
  customFieldsData.customFields = mapCustomFields(customFieldsData.customFields, false);

  commitEditingData(commit, stepKey, customFieldsData);
  dataObject.customFieldsData = customFieldsData;

  return dataObject;
}

function populateEditingPublicationInfo(commit, metadataRecord, snakeCaseJSON) {

  const dataObject = {};

  let stepKey = EDITMETADATA_PUBLICATION_INFO;
  const publicationData = getFrontendJSONForStep(stepKey, snakeCaseJSON);
  publicationData.visibilityState = getMetadataVisibilityState(metadataRecord);

  commitEditingData(commit, stepKey, publicationData);
  dataObject.publicationData = publicationData;

  stepKey = EDITMETADATA_FUNDING_INFO;
  const fundingData = getFrontendJSONForStep(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, fundingData);
  dataObject.fundingData = fundingData;

  stepKey = EDITMETADATA_ORGANIZATION;
  const organizationData = getFrontendJSONForStep(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, organizationData);
  dataObject.organizationData = organizationData;

  return dataObject;
}

export function populateEditingComponents(commit, metadataRecord, categoryCards) {

  const snakeCaseJSON = convertJSON(metadataRecord, false);

  const { headerData, keywordsData } = populateEditingMain(commit, categoryCards, snakeCaseJSON);

  const { authors } = populateEditingAuthors(commit, snakeCaseJSON);

  const { dataInfo } = populateEditingDataInfo(commit, snakeCaseJSON);

  populateEditingResources(commit, snakeCaseJSON);

  populateEditingRelatedResearch(commit, snakeCaseJSON);

  const { publicationData } = populateEditingPublicationInfo(commit, metadataRecord, snakeCaseJSON);

  // enhanced Header for the preview infos
  const stepKey = EDITMETADATA_MAIN_HEADER;

  const enhanceHeader = {
    ...headerData,
    keywords: keywordsData.keywords,
    authors,
    dataLicense: dataInfo.dataLicenseTitle,
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
        console.log(`sizeValue parsing failed resource id: ${resource.id}`);
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
  if (urlName.length > 80) {
    // only a max of 80 is allowed by the backend for the url
    urlName = urlName.substring(0, 80);
  }
  return urlName;
}
