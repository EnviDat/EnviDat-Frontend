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

import { format, parse } from 'date-fns';
import seedrandom from 'seedrandom';

import { getAuthorName, getAuthorsString } from '@/factories/authorFactory';

import {
  ACCESS_LEVEL_PUBLIC_VALUE,
  getAllowedUserNamesArray,
} from '@/factories/userEditingFactory';

import {
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_MULTIPOLYGON,
  LOCATION_TYPE_POINT,
  LOCATION_TYPE_POLYGON,
  METADATA_DEPRECATEDRESOURCES_PROPERTY,
  METADATA_STATE_DRAFT,
  METADATA_STATE_INVISILBE,
  METADATA_STATE_VISILBE,
  PUBLICATION_STATE_PENDING,
  PUBLICATION_STATE_PUBLISHED,
  PUBLICATION_STATE_RESERVED,
} from '@/factories/metadataConsts';

import {
  enhanceTags,
  getCategoryColor,
  guessTagCategory,
} from '@/factories/keywordsFactory';

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

/**
 * @param {String} date expecting a format like 2017-08-15T15:25:45.175790
 * @param {String} inputFormat, it's optional
 * @return {String} Returns a date string containing the date and hours:minutes:seconds
 */
export function formatDate(date, inputFormat = 'yyyy-MM-dd') {
  // expecting a format like 2017-08-15T15:25:45.175790
  let formatedDate = '';

  if (date) {
    const split = date.split('T');
    if (split.length > 1) {
      const dateOnly = split[0];
      const parsedDate = parse(dateOnly, inputFormat, new Date(date));
      const newDate = format(parsedDate, 'd. MMM yyyy');

      const timeOnly = split[1];
      const timeSplit = timeOnly.split('.');
      let timeToMinutes = timeSplit[0];
      timeToMinutes = timeToMinutes.substring(0, 5);

      formatedDate = `${newDate} ${timeToMinutes}`;
    } else {
      // fallback: just return the input
      formatedDate = date;
    }
  }

  return formatedDate;
}

export function getMetadataVisibilityState(metadata) {
  const state = metadata?.state || null;
  const priv = metadata?.private || undefined;

  let visibilityState = METADATA_STATE_DRAFT;

  if (state === 'active') {
    visibilityState = priv ? METADATA_STATE_INVISILBE : METADATA_STATE_VISILBE;
  }

  return visibilityState;
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

export function createHeader(dataset, smallScreen, authorDeadInfo = null) {
  if (!dataset) {
    return null;
  }
  let { maintainer } = dataset;

  if (typeof dataset.maintainer === 'string') {
    try {
      maintainer = JSON.parse(dataset.maintainer);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Maintainer json parse err: ${e}`);
    }
  }

  const contactEmail = maintainer?.email || '';

  let authors = null;

  if (typeof dataset.author === 'string') {
    try {
      authors = JSON.parse(dataset.author);
    } catch (e) {
      // eslint-disable-next-line no-console
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
    metadataTitle: dataset.title,
    doi: dataset.doi,
    contactName: maintainer ? getAuthorName(maintainer) : '',
    contactEmail,
    tags: dataset.tags,
    titleImg: dataset.titleImg,
    maxTags: smallScreen ? 5 : 12,
    authors,
    authorDeadInfo,
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
      // eslint-disable-next-line no-console
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
    dataset.resources.forEach(element => {
      const res = createResource(
        element,
        dataset.name,
        organizationID,
        signedInUserName,
        signedInUserOrganizationIds,
      );
      res.metadataContact = contactEmail;

      resources.push(res);
    });
  }

  return {
    metadataId: dataset.id,
    metadataTitle: dataset.title,
    doi: dataset.doi,
    resources,
  };
}

export function getOrganizationMap(organizations) {
  const mainOrgas = {};
  const topLevel = [];

  for (let i = 0; i < organizations.length; i++) {
    const orga = organizations[i];
    let orgasSublist = null;

    if (orga?.groups?.length > 0) {
      const main = orga.groups[0].name;
      if (main && !mainOrgas[main]) {
        mainOrgas[main] = [];
      }

      orgasSublist = mainOrgas[main];
    }

    if (orgasSublist && !orgasSublist.includes(orga)) {
      orgasSublist.push(orga);
    } else {
      topLevel.push(orga);
    }
  }

  for (let i = 0; i < topLevel.length; i++) {
    const k = topLevel[i];
    mainOrgas[k.name] = k;
  }

  return mainOrgas;
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

function getMultiPointArray(coordinates) {
  // Return a multipoint array with swapped point coordinates
  const pointArray = [];
  coordinates.forEach(coord => {
    const swappedCoord = [coord[1], coord[0]];
    pointArray.push(swappedCoord);
  });

  return pointArray;
}

function getPolygonPointArray(coordinates) {
  // Return a polygon array with swapped point coordinates, accepts holes
  const polygonArray = [];
  coordinates.forEach(outerArray => {
    const pointArray = [];
    outerArray.forEach(coord => {
      const swappedCoord = [coord[1], coord[0]];
      pointArray.push(swappedCoord);
    });
    polygonArray.push(pointArray);
  });

  return polygonArray;
}

function getMultiPolygonPointArray(coordinates) {
  // Return a multipolygon array with swapped point coordinates, accepts holes
  const multiPolyArray = [];
  coordinates.forEach(polygon => {
    const polygonArray = [];
    polygon.forEach(outerArray => {
      const pointArray = [];
      outerArray.forEach(coord => {
        const swappedCoord = [coord[1], coord[0]];
        pointArray.push(swappedCoord);
      });
      polygonArray.push(pointArray);
    });
    multiPolyArray.push(polygonArray);
  });

  return multiPolyArray;
}

/**
 * Extract each geometry individually from a multipoint or multipolygon
 *
 * @param {Object} multiGeom valid MultiPoint or MultiPolygon GeoJSON
 * @returns {Array} array of single GeoJSON geometries (Point or Polygon)
 */
function extractGeomsFromMultiGeoms(multiGeom) {
  let geomType = '';
  if (multiGeom.isMultiPoint) {
    geomType = 'Point';
  } else if (multiGeom.isMultiPolygon) {
    geomType = 'Polygon';
  }

  const geomArray = [];
  multiGeom.geoJSON.coordinates.forEach(geomCoords => {
    const formattedGeom = {
      type: geomType,
      coordinates: geomCoords,
    };
    geomArray.push(formattedGeom);
  });

  return geomArray;
}

/**
 * Extract an array of coordinate arrays with swapped point coordinates for each geom
 *
 * @param {Array} geometries array of GeoJSON objects from GeometryCollection (.geometries)
 * @returns {Array} array of geometry arrays, with swapped coordinates
 */
function getGeomCollectionPointArray(geometries) {
  // Return an array of coordinate arrays with swapped point coordinates for each geom

  let pointArray = [];
  const geomCollectionArray = [];
  let category = '';

  geometries.forEach(geometry => {
    if (geometry.type === LOCATION_TYPE_POINT) {
      pointArray = [geometry.coordinates[1], geometry.coordinates[0]];
      category = 'isPoint';
    } else if (geometry.type === LOCATION_TYPE_POLYGON) {
      pointArray = getPolygonPointArray(geometry.coordinates);
      category = 'isPolygon';
    } else if (geometry.type === LOCATION_TYPE_MULTIPOINT) {
      pointArray = getMultiPointArray(geometry.coordinates);
      category = 'isMultiPoint';
    } else if (geometry.type === LOCATION_TYPE_MULTIPOLYGON) {
      pointArray = getMultiPolygonPointArray(geometry.coordinates);
      category = 'isMultiPolygon';
    }
    geomCollectionArray.push({ [category]: true, pointArray });
  });

  return geomCollectionArray;
}

/**
 * Parse geometries into GeometryCollection GeoJSON format
 *
 * @export
 * @param {Array} geomArray array of valid GeoJSON geometries
 * @param {Object} [propertiesObj={}] key:value mapping for properties included in output GeoJSON
 * @returns {Object} GeoJSON of GeometryCollection type
 */
export function parseAsGeomCollection(geomArray, propertiesObj = {}) {
  if (!geomArray) {
    return null;
  }

  return {
    type: 'GeometryCollection',
    geometries: geomArray,
    properties: propertiesObj,
  };
}

/**
 * Create location object containing geometries for geospatial components
 *
 * @export
 * @param {Object} dataset CKAN metadata entry object
 * @returns {Object} extracted and transformed spatial field prop for geospatial components
 */
export function createLocation(dataset) {
  if (!dataset) {
    return null;
  }

  // If already GeoJSON return, else WKT
  if (typeof dataset.location === 'object') {
    return dataset.location;
  }

  const location = {
    id: dataset.id,
    name: dataset.name,
    title: dataset.title,
  };

  if (dataset.spatial) {
    location.geoJSON = dataset.spatial;

    // parseJSON because the geoJOSN from CKAN might be invalid!

    let spatialJSON = dataset.spatial;

    if (typeof dataset.spatial === 'string') {
      try {
        spatialJSON = JSON.parse(dataset.spatial);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`MetaDataFactory: geojson parsing error ${error}`);
      }
    }

    if (spatialJSON) {
      location.geoJSON = spatialJSON;
      location.isPolygon = spatialJSON.type === LOCATION_TYPE_POLYGON;
      location.isPoint = spatialJSON.type === LOCATION_TYPE_POINT;
      location.isMultiPoint = spatialJSON.type === LOCATION_TYPE_MULTIPOINT;
      location.isMultiPolygon = spatialJSON.type === LOCATION_TYPE_MULTIPOLYGON;
      location.isGeomCollection =
        spatialJSON.type === LOCATION_TYPE_GEOMCOLLECTION;

      // Swap lngLat to latLng because the geoJOSN from CKAN might be invalid!

      let geomCollection = [spatialJSON];

      if (location.isPoint) {
        // swap coords for the leaflet map
        location.pointArray = [
          spatialJSON.coordinates[1],
          spatialJSON.coordinates[0],
        ];
      } else if (location.isPolygon) {
        location.pointArray = getPolygonPointArray(spatialJSON.coordinates);
      } else if (location.isMultiPoint) {
        location.pointArray = getMultiPointArray(spatialJSON.coordinates);
        geomCollection = extractGeomsFromMultiGeoms(location);
      } else if (location.isMultiPolygon) {
        location.pointArray = getMultiPolygonPointArray(
          spatialJSON.coordinates,
        );
        geomCollection = extractGeomsFromMultiGeoms(location);
      } else if (location.isGeomCollection) {
        location.pointArray = getGeomCollectionPointArray(
          spatialJSON.geometries,
        );
        geomCollection = spatialJSON.geometries;
      }

      location.geomCollection = parseAsGeomCollection(geomCollection, {
        name: location.name,
      });
    }
  }

  return location;
}

let lastCategory = '';
let tempImgKeys = [];
let tempImgValues = [];

/**
 * @param {object} metadata
 * @param {object} cardBGImages it's an object of key value pairs paths to images
 *
 * @param {Array<Object>} categoryCards
 * @return {object} metadata entry enhanced with a title image based on its tags
 */
export function enhanceTitleImg(metadata, cardBGImages, categoryCards) {
  if (!metadata || !categoryCards) {
    return null;
  }

  /* eslint-disable no-param-reassign */
  const category = guessTagCategory(metadata.tags);

  if (cardBGImages) {
    if (category !== lastCategory) {
      const categoryImages = cardBGImages[category];
      tempImgKeys = Object.keys(categoryImages);
      tempImgValues = Object.values(categoryImages);
      lastCategory = category;
    }

    const max = tempImgKeys.length - 1;
    const randomIndex = randomInt(0, max, metadata.title);

    metadata.titleImg = randomIndex >= 0 ? tempImgValues[randomIndex] : 0;
  }

  metadata.categoryColor = getCategoryColor(categoryCards, category);

  return metadata;
}

/**
 * @param {Object} metadataEntry
 * @param {Array} cardBGImages
 * @param {Array} categoryCards
 *
 * @return {Object} metadataEntry enhanced with a title image based on the entrys tags
 */
export function enhanceMetadataEntry(
  metadataEntry,
  cardBGImages,
  categoryCards,
) {
  if (!metadataEntry || !categoryCards) {
    return null;
  }

  if (!metadataEntry.titleImg) {
    enhanceTitleImg(metadataEntry, cardBGImages, categoryCards);
  }

  return metadataEntry;
}

/**
 * @param {Array} metadatas
 * @param {Array} cardBGImages
 *
 * @param categoryCards
 * @return {Array} metadatas enhanced with a title image based on the metadatas tags
 */
export function enhanceMetadatasTitleImage(
  metadatas,
  cardBGImages,
  categoryCards,
) {
  if (metadatas === undefined) {
    return undefined;
  }

  if (Array.isArray(metadatas)) {
    for (let i = 0; i < metadatas.length; i++) {
      const el = metadatas[i];

      if (!el.titleImg) {
        metadatas[i] = enhanceTitleImg(el, cardBGImages, categoryCards);
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

export const defaultSwissLocation = {
  type: 'GeometryCollection',
  geometries: [
    {
      type: 'Polygon',
      coordinates: [
        [
          [5.95587, 45.81802],
          [5.95587, 47.80838],
          [10.49203, 47.80838],
          [10.49203, 45.81802],
          [5.95587, 45.81802],
        ],
      ],
    },
  ],
};
export const defaultWorldLocation = {
  type: 'GeometryCollection',
  geometries: [
    {
      type: 'Polygon',
      coordinates: [
        [
          [-175, -85],
          [-175, 85],
          [175, 85],
          [175, -85],
          [-175, -85],
        ],
      ],
    },
  ],
};

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
 * @param cardBGImages
 * @param categoryCards
 * @param mode
 * @returns {{}}
 */
export function enhanceMetadatas(datasets, cardBGImages, categoryCards) {
  if (!(datasets instanceof Array)) {
    throw new Error(
      `enhanceMetadatas() expects an array of datasets got ${typeof datasets}`,
    );
  }

  const enhancedContent = {};

  for (let i = 0; i < datasets.length; i++) {
    let dataset = datasets[i];
    dataset = enhanceMetadataEntry(dataset, cardBGImages, categoryCards);

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

export function unpackDeprecatedResources(customFields) {
  let unpackedResourceIds = [];

  if (customFields?.length > 0) {
    const customFieldEntry = customFields.filter(
      entry => entry?.fieldName === METADATA_DEPRECATEDRESOURCES_PROPERTY,
    )[0];
    const stringResourceIds = customFieldEntry?.content || '[]';
    unpackedResourceIds = JSON.parse(stringResourceIds);
  }

  return unpackedResourceIds;
}
