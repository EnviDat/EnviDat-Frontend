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

import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_CUSTOMFIELDS_ENTRY,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_GEO_SPATIAL,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_INFO_DATES,
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

import { format, isValid, parse } from 'date-fns';
import { mergeEditingAuthor } from '@/factories/authorFactory';
import {
  enhanceElementsWithStrategyEvents,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';

export const DATE_PROPERTY_DATE_TYPE = 'dateType';
export const DATE_PROPERTY_START_DATE = 'dateStart';
export const DATE_PROPERTY_END_DATE = 'dateEnd';

/**
 * Json conversion rules from frontend to backend and vise versa
 * https://stackoverflow.com/questions/50081462/javascript-how-to-map-a-backend-entity-to-a-frontend-entity-and-the-opposite
 */
const JSONFrontendBackendRules = {
  [EDITMETADATA_MAIN_HEADER]: [
    ['metadataTitle','title'],
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
    ['dataLicenseId','license_id'],
    ['dataLicenseTitle','license_title'],
    ['dataLicenseUrl','license_url'],
  ],
  [EDITMETADATA_DATA_INFO_DATES]: [
    // special case because the snakeCase is done before
    // only a renaming is needed
    [DATE_PROPERTY_DATE_TYPE,'dateType'],
    [DATE_PROPERTY_START_DATE,'date'],
    [DATE_PROPERTY_END_DATE,'endDate'],
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

export function getBackendJSON(stepKey, data) {
  const rules = JSONFrontendBackendRules[stepKey];

  if (!rules) {
    return null;
  }

  let backEndJson = {};

  rules.forEach(x => convertPut(backEndJson, x[1], convertGet(data, x[0])));

  backEndJson = getObjectInOtherCase(backEndJson, toSnakeCase);

  return backEndJson;
}

export function getFrontendJSON(stepKey, data) {
  const rules = JSONFrontendBackendRules[stepKey];

  if (!rules) {
    return null;
  }

  const backendJSON = data;

  let frontEndJson = {};

  rules.forEach(x => convertPut(frontEndJson, x[0], convertGet(backendJSON, x[1])));

  frontEndJson = getObjectInOtherCase(frontEndJson, toCamelCase);

  return frontEndJson;
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
    resourceSize,
    restricted,
  }
}

export function cleanListForBackend(elementList, mappingKey) {

  const cleanedElements = [];
  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];
    let cleaned = getBackendJSON(mappingKey, element);

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
    const cleaned = getFrontendJSON(mappingKey, element);
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

  const cleanedResSize = getFrontendJSON(EDITMETADATA_DATA_RESOURCE_SIZE, resSize);

  let restricted = resource.restricted;

  if (typeof restricted === 'string') {
    try {
      restricted = JSON.parse(restricted);
    } catch (e) {
      console.log(`restricted parsing failed (fallback used!) resource id: ${resource.id}`);
      restricted = { allowed_users: '', level: 'public', shared_secret: '' };
    }
  }

  const cleanedRestricted = getFrontendJSON(EDITMETADATA_DATA_RESTRICTED, restricted);
  
  return {
    ...resource,
    resourceSize: cleanedResSize,
    restricted: cleanedRestricted,
  }
}

export function cleanSpatialInfo(spatial) {
  const rules = JSONFrontendBackendRules[EDITMETADATA_DATA_GEO_SPATIAL];

  const backEndJson = {};

  rules.forEach(x => convertPut(backEndJson, x[1], convertGet(spatial, x[0])));

  return backEndJson;
}

// possible publication states: ['', 'published', 'approved', 'publication pending', 'publication requested']
const readOnlyMappingRules = [
  {
    triggerRule: ['published'],
    explanation: 'This field is "readonly" because the publication state is : "published".',
    readOnlyFields: [
      // EditMetadataHeader
      'metadataTitle',
      // EditAuthorList
      'authors',
      // EditPublicationInfo
      'publicationYear',
      'publisher',
      'doi',
      // not implemented yet
      'metadataUrl',
    ],
  },
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
  commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
      {
        object: eventName,
        data,
      },
      { root: true },
  );
}

function mapCustomFields(fields, frontendToBackend = true) {
  const backendEntries = [];

  if (!fields) {
    return backendEntries;
  }

  for (let i = 0; i < fields.length; i++) {
    let mappedEntry = null;
    if (frontendToBackend) {
      mappedEntry = getBackendJSON(EDITMETADATA_CUSTOMFIELDS_ENTRY, fields[i]);
    } else {
      mappedEntry = getFrontendJSON(EDITMETADATA_CUSTOMFIELDS_ENTRY, fields[i]);
    }
    backendEntries.push(mappedEntry);
  }

  return backendEntries;
}

function formatDates(dates) {
  const formattedDates = [];

  for (let i = 0; i < dates.length; i++) {
    const dateEntry = dates[i];

    const entry = getFrontendJSON(EDITMETADATA_DATA_INFO_DATES, dateEntry);
    entry.dateStart = formatDate(entry.dateStart) || '';
    entry.dateEnd = formatDate(entry.dateEnd) || '';

    formattedDates.push(entry);
  }

  return formattedDates;
}

function populateEditingMain(commit, categoryCards, snakeCaseJSON) {

  const dataObject = {};

  let stepKey = EDITMETADATA_MAIN_HEADER;
  const headerData = getFrontendJSON(stepKey, snakeCaseJSON);
  // the commiting of the EDITMETADATA_MAIN_HEADER is done later on,
  // with additional data from other "steps"

  dataObject.headerData = headerData;

  stepKey = EDITMETADATA_MAIN_DESCRIPTION;
  const descriptionData = getFrontendJSON(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, descriptionData);
  dataObject.descriptionData = descriptionData;

  stepKey = EDITMETADATA_KEYWORDS;
  const enhanceDataset = enhanceTags(snakeCaseJSON, categoryCards);
  const keywordsData = getFrontendJSON(stepKey, enhanceDataset);

  const enhancedKeywords = {
    ...keywordsData,
    metadataCardTitle: headerData.metadataTitle,
    metadataCardSubtitle: descriptionData.description,
  }

  commitEditingData(commit, stepKey, enhancedKeywords);
  dataObject.keywordsData = keywordsData;

  return dataObject;
}

function populateEditingAuthors(commit, snakeCaseJSON, authorsMap) {

  const dataObject = {};

  const stepKey = EDITMETADATA_AUTHOR_LIST;
  // const backendAuthors = getFrontendJSON(stepKey, snakeCaseJSON);

  const authors = []
  snakeCaseJSON.author.forEach((bAuthor) => {
    const author = getFrontendJSON(EDITMETADATA_AUTHOR, bAuthor);

    if (typeof author.dataCredit === 'string') {
      author.dataCredit = [author.dataCredit];
    }

    authors.push(author);
  })

  let enhanceAuthors = []

  if (authorsMap && Object.keys(authorsMap).length > 0) {

    for (let i = 0; i < authors.length; i++) {
      const auth = authors[i];
      const existingAuthor = authorsMap[auth.email];
      let enhanced = auth;

      if (existingAuthor) {
        enhanced = mergeEditingAuthor(auth, existingAuthor);
      }

      enhanceAuthors.push(enhanced);
    }
  } else {
    enhanceAuthors = authors;
  }

  commitEditingData(commit, stepKey, { authors: enhanceAuthors });
  dataObject.authors = authors;

  return dataObject;
}

function populateEditingDataInfo(commit, snakeCaseJSON) {

  const dataObject = {};

  // Stepper 2: Data Resources, Info, Location
  // const resources = createResources(metadataRecord).resources;

  let stepKey = EDITMETADATA_DATA_INFO;
  const dateInfoData = getFrontendJSON(stepKey, snakeCaseJSON);

  dateInfoData.dates = formatDates(dateInfoData.dates);

  const dataInfo = {
    // for now only use the title, check how to choose it in the
    // edit component
    dataLicenseId: dateInfoData.dataLicenseId,
    ...dateInfoData,
  };

  commitEditingData(commit, stepKey, dataInfo);
  dataObject.dataInfo = dataInfo;


  stepKey = EDITMETADATA_DATA_GEO;
  const geoData = getFrontendJSON(stepKey, snakeCaseJSON);

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

  const stepKey = EDITMETADATA_DATA_RESOURCES;
  const resourceData = getFrontendJSON(stepKey, snakeCaseJSON);
  const resources = resourceData.resources;

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
  const rPublicationData = getFrontendJSON(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, rPublicationData);
  dataObject.relatedPublicationData = rPublicationData;

  stepKey = EDITMETADATA_RELATED_DATASETS;
  const rDatasetsData = getFrontendJSON(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, rDatasetsData);
  dataObject.relatedDatasetsData = rDatasetsData;

  stepKey = EDITMETADATA_CUSTOMFIELDS;
  const customFieldsData = getFrontendJSON(stepKey, snakeCaseJSON);
  customFieldsData.customFields = mapCustomFields(customFieldsData.customFields, false);

  commitEditingData(commit, stepKey, customFieldsData);
  dataObject.customFieldsData = customFieldsData;

  return dataObject;
}

function populateEditingPublicationInfo(commit, metadataRecord, snakeCaseJSON) {

  const dataObject = {};

  let stepKey = EDITMETADATA_PUBLICATION_INFO;
  const publicationData = getFrontendJSON(stepKey, snakeCaseJSON);
  publicationData.visibilityState = getMetadataVisibilityState(metadataRecord);

  commitEditingData(commit, stepKey, publicationData);
  dataObject.publicationData = publicationData;

  stepKey = EDITMETADATA_FUNDING_INFO;
  const fundingData = getFrontendJSON(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, fundingData);
  dataObject.fundingData = fundingData;

  stepKey = EDITMETADATA_ORGANIZATION;
  const organizationData = getFrontendJSON(stepKey, snakeCaseJSON);

  commitEditingData(commit, stepKey, organizationData);
  dataObject.organizationData = organizationData;

  return dataObject;
}

export function populateEditingComponents(commit, metadataRecord, categoryCards, authorsMap) {

  const snakeCaseJSON = convertJSON(metadataRecord, false);

  const { headerData, keywordsData } = populateEditingMain(commit, categoryCards, snakeCaseJSON);

  const { authors } = populateEditingAuthors(commit, snakeCaseJSON, authorsMap);

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

function mapDatesForBackend(datesArray) {

  if (!Array.isArray(datesArray) || datesArray.length <= 0) {
    const entry = getBackendJSON(EDITMETADATA_DATA_INFO_DATES, {
      dateType: 'creation',
      dateStart: '',
      dateEnd: '',
    });

    return [entry];
  }

  const mappedDates = [];

  for (let i = 0; i < datesArray.length; i++) {
    const dateEntry = datesArray[i];

    const entry = getBackendJSON(EDITMETADATA_DATA_INFO_DATES, dateEntry);
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

export function mapFrontendToBackend(stepKey, frontendData) {

  // create a local copy to avoid mutation of vuex store objects / properties
  const localData = { ...frontendData };

  if (stepKey === EDITMETADATA_DATA_RESOURCES) {
    localData.resources = cleanListForBackend(localData.resources, EDITMETADATA_DATA_RESOURCE);
  } else if (stepKey === EDITMETADATA_AUTHOR_LIST) {
    localData.authors = cleanListForBackend(localData.authors, EDITMETADATA_AUTHOR);
  } else if (stepKey === EDITMETADATA_DATA_INFO) {
    localData.dates = mapDatesForBackend(localData.dates);
  } else if (stepKey === EDITMETADATA_CUSTOMFIELDS) {
    localData.customFields = mapCustomFields(localData.customFields);
  }

  let backendData = getBackendJSON(stepKey, localData);

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
