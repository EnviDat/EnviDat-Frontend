/**
 * function factory for metadata object creation methods by parsing
 * the json from the backend.
 *
 * @summary function factory for metadata object creation methods
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:07:03
 * Last modified  : 2021-09-01 13:19:14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { format, formatISO, parse } from 'date-fns';
import seedrandom from 'seedrandom';

import {getAuthorName, getAuthorsCitationString, getAuthorsString} from '@/factories/authorFactory';
import { localIdProperty } from '@/factories/strategyFactory';
import { DIVERSITY, FOREST, HAZARD, LAND, METEO, SNOW } from '@/store/categoriesConsts';

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
 * @param {Array} tags
 *
 * @return {String} category based on tags array
 */
export function guessTagCategory(tags) {
  if (!tags) {
    return LAND;
  }

  for (let i = 0; i < tags.length; i++) {
    const element = tags[i];
    const name = element.name;

    switch (true) {
      case name.includes('HAZARD'):
      case name.includes('ACCIDENTS'):
      case name.includes('FATALITIES'):
        return HAZARD;
      case name.includes('DIVERSITY'):
        return DIVERSITY;
      case name.includes('FOREST'):
        return FOREST;
      case name.includes('SNOW'):
      case name.includes('AVALANCHE'):
        return SNOW;
      case name.includes('METEO'):
      case name.includes('CLIMATE'):
        return METEO;
      case name.includes('LAND'):
        return LAND;
      default:
    }
  }

  return LAND;
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
      timeToMinutes = timeToMinutes.substr(0, 5);

      formatedDate = `${newDate} ${timeToMinutes}`;
    } else {
      // fallback: just return the input
      formatedDate = date;
    }
  }

  return formatedDate;
}

/**
 * @returns {String} ISO Formated Date String from now
 */
export function getCurrentDate() {
  const now = new Date();
  const isoFormatted = formatISO(now);
  return formatDate(isoFormatted);
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

  const license = createLicense(dataset);

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

  return {
    metadataTitle: dataset.title,
    doi: dataset.doi,
    contactName: maintainer ? getAuthorName(maintainer) : '',
    contactEmail,
    licenseId: license.id,
    license: license.title,
    licenseUrl: license.url,
    tags: dataset.tags,
    titleImg: dataset.titleImg,
    maxTags: smallScreen ? 5 : 12,
    authors,
    authorDeadInfo,
    categoryColor: dataset.categoryColor,
    organization: dataset.organization?.name || '',
    organizationTooltip: dataset.organization?.title || '',
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

export function createCitation(dataset) {
  if (!dataset) {
    return null;
  }

  const ckanDomain = process.env.VITE_ENVIDAT_PROXY;

  const authors = getAuthorsCitationString(dataset);
  const title = dataset.title;

  let text = `${authors.trim()}  <span style="font-weight: bold;" >${title}.</span> `;

  let { publication } = dataset;

  if (typeof dataset.publication === 'string') {
    publication = JSON.parse(dataset.publication);
  }

  if (publication && publication.publisher) {
    text += ` <span style="font-style: italic;" >${publication.publisher}</span> `;
  }

  if (publication && publication.publication_year || publication.publicationYear) {
    text += ` <span style="font-weight: bold;" >${publication.publication_year || publication.publicationYear}</span>, `;
  }

  if (dataset.doi) {
    text += ` <a href="https://www.doi.org/${dataset.doi}" target="_blank">https://www.doi.org/${dataset.doi}</a>. `;
  }

/*
  text += ` <a href="${ckanDomain}/#/metadata/${dataset.name}" target="_blank">Institutional Repository</a> `;
*/

  return {
    id: dataset.id,
    citationText: text,
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

let localResoureID = 0;

export function initializeLocalResource(metadataId, file = null, url = '') {
  const isLink = !!url;
  const resourceFormat = isLink ? 'url' : getFileFormat(file);
  let resourceName = isLink ? '' : file.name;
  const fileName = isLink ? '' : file.name;
  const size = !isLink ? file.size : 0;

  if (!isLink) {
    const splits = resourceName.split('.');
    resourceName = splits[0];
  }

  localResoureID++;

  const now = getCurrentDate();

  return {
    metadataId,
    name: resourceName,
    fileName,
    file,
    size,
    id: `resoureId_${localResoureID}`,
    [localIdProperty]: `resoureId_${localResoureID}`,
    url_type: isLink ? '' : 'upload',
    format: resourceFormat,
    url,
    existsOnlyLocal: true,
    created: now,
    lastModified: now,
    loading: false,
  };
}

export function createLocalResource(
  metadataId,
  name,
  description,
  file,
  fileFormat = '',
  size = 0,
  url = '',
  doi = '',
  restricted = false,
) {
  const isLink = !!url;
  const resourceFormat = isLink ? 'url' : fileFormat;

  const created = getCurrentDate();

  return {
    description,
    metadataId,
    url_type: isLink ? '' : 'upload',
    id: '',
    size,
    // mimetype: resource.mimetype ? resource.mimetype : '',
    // cacheUrl: resource.cache_url ? resource.cache_url : '',
    doi,
    name,
    url,
    restricted,
    format: resourceFormat,
    existsOnlyLocal: true,
    // state: resource.state ? resource.state : '',
    created,
    lastModified: created,
    // position: resource.position ? resource.position : '',
    // revisionId: resource.revision_id ? resource.revision_id : '',
    isProtected: restricted,
  };
}

export function createResource(resource, datasetName) {
  if (!resource) {
    return null;
  }

  let isProtected = false;
  let restrictedUsers;
  let restrictedObj = false;

  if (
    resource.restricted &&
    typeof resource.restricted === 'string' &&
    resource.restricted.length > 0
  ) {
    try {
      restrictedObj = JSON.parse(resource.restricted);
      isProtected = restrictedObj.level !== 'public';
      restrictedUsers = restrictedObj.allowed_users !== '';
      // "{"allowed_users": "", "level": "public", "shared_secret": ""}"
    } catch (err) {
      isProtected = !resource.restricted.includes('public');
    }
  }

  let resURL = resource.url;

  if (
    isProtected ||
    (typeof restrictedUsers === 'boolean' && restrictedUsers === true)
  ) {
    const splits = resource.url.split('resource');
    if (splits && splits.length > 0) {
      resURL = splits[0];
    } else {
      resURL = '';
    }
  }

  let fileFormat = resource.format ? resource.format : '';
  fileFormat = fileFormat.replace('.', '').toLowerCase();

  const created = formatDate(resource.created);
  const modified = formatDate(resource.last_modified);

  const ckanDomain = process.env.VITE_ENVIDAT_PROXY;

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
    mimetype: resource.mimetype ? resource.mimetype : '',
    cacheUrl: resource.cache_url ? resource.cache_url : '',
    doi: resource.doi,
    name: fileName,
    url: resURL,
    urlType: resource.url_type,
    restrictedUrl: `${ckanDomain}/dataset/${datasetName}/resource/${resource.id}`,
    restricted: resource.restricted ? resource.restricted : '',
    format: fileFormat,
    state: resource.state ? resource.state : '',
    created,
    lastModified: modified,
    position: resource.position ? resource.position : '',
    revisionId: resource.revision_id ? resource.revision_id : '',
    isProtected,
    previewUrl: resource.preview_url ? resource.preview_url : '',
  };
}

export function createResources(dataset) {
  if (!dataset) {
    return null;
  }

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
    dataset.resources.forEach((element) => {
      const res = createResource(element, dataset.name);
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

export function getMetadataVisibilityState(metadata) {
  const state = metadata?.state || null;
  const priv = metadata?.private || undefined;

  let visibilityState = 'draft';

  if (state === 'active') {
    visibilityState = priv ? 'unpublished' : 'published';
  }

  return visibilityState;
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
  coordinates.forEach((coord) => {
    const swappedCoord = [coord[1], coord[0]];
    pointArray.push(swappedCoord);
  });

  return pointArray;
}

function getPolygonPointArray(coordinates) {
  // Return a polygon array with swapped point coordinates, accepts holes
  const polygonArray = [];
  coordinates.forEach((outerArray) => {
    const pointArray = [];
    outerArray.forEach((coord) => {
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
  coordinates.forEach((polygon) => {
    const polygonArray = [];
    polygon.forEach((outerArray) => {
      const pointArray = [];
      outerArray.forEach((coord) => {
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
  multiGeom.geoJSON.coordinates.forEach((geomCoords) => {
    const formattedGeom = {
      type: geomType,
      coordinates: geomCoords,
    };
    geomArray.push(formattedGeom);
  });

  return geomArray;
}

export const LOCATION_TYPE_POINT = 'Point';
export const LOCATION_TYPE_MULTIPOINT = 'MultiPoint';
export const LOCATION_TYPE_POLYGON = 'Polygon';
export const LOCATION_TYPE_MULTIPOLYGON = 'MultiPolygon';
export const LOCATION_TYPE_GEOMCOLLECTION = 'GeometryCollection';
export const LOCATION_TYPE_FEATCOLLECTION = 'FeatureCollection';


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

  geometries.forEach((geometry) => {
    if (geometry.type === LOCATION_TYPE_POINT) {
      pointArray = [geometry.coordinates[1], geometry.coordinates[0]];
    } else if (geometry.type === LOCATION_TYPE_POLYGON) {
      pointArray = getPolygonPointArray(geometry.coordinates);
    } else if (geometry.type === LOCATION_TYPE_MULTIPOINT) {
      pointArray = getMultiPointArray(geometry.coordinates);
    } else if (geometry.type === LOCATION_TYPE_MULTIPOLYGON) {
      pointArray = getMultiPolygonPointArray(geometry.coordinates);
    }
    geomCollectionArray.push(pointArray);
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
export function parseAsGeomCollection(geomArray, propertiesObj={}) {

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
      location.isGeomCollection = spatialJSON.type === LOCATION_TYPE_GEOMCOLLECTION;

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
        location.pointArray = getMultiPolygonPointArray(spatialJSON.coordinates);
        geomCollection = extractGeomsFromMultiGeoms(location);

      } else if (location.isGeomCollection) {
        location.pointArray = getGeomCollectionPointArray(spatialJSON.geometries);
        geomCollection = spatialJSON.geometries;

      }

      location.geomCollection = parseAsGeomCollection(geomCollection, location.name);

    }
  }

  return location;
}

export function convertTags(tagsStringArray, tagsEnabled) {
  const tagObjs = [];

  tagsStringArray.forEach((element) => {
    tagObjs.push({
      name: element,
      enabled: tagsEnabled,
    });
  });

  return tagObjs;
}

export function getCategoryColor(categoryCards, categoryName) {
  for (let i = 0; i < categoryCards.length; i++) {
    const cat = categoryCards[i];
    if (cat.type === categoryName) {
      return cat.color;
    }
  }

  return null;
}

export function getTagColor(categoryCards, tagName) {
  if (!categoryCards || !tagName) {
    return '';
  }

  for (let i = 0; i < categoryCards.length; i++) {
    const cat = categoryCards[i];
    const name = tagName.toLowerCase();

    if (name.includes(cat.type) || cat.alias.includes(name)) {
      return cat.darkColor;
    }
  }

  return '#e0e0e0';
}

export function enhanceTags(dataset, categoryCards) {
  if (!dataset || !categoryCards) {
    return null;
  }

  if (dataset.tags && dataset.tags instanceof Array) {
    for (let j = 0; j < dataset.tags.length; j++) {
      const tag = dataset.tags[j];
      tag.color = getTagColor(categoryCards, tag.name);
    }
  }

  return dataset;
}

let lastCategory = '';
let tempImgKeys = [];
let tempImgValues = [];

/**
 * @param {Object} metadata
 * @param {Object<String, String>} cardBGImages, it's an object of key value pairs paths to images
 *
 * @param {Array<Object>} categoryCards
 * @return {Object} metadata entry enhanced with a title image based on its tags
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
 *
 * @return {Object} metadataEntry enhanced with a title image based on the entrys tags
 */
export function enhanceMetadataEntry(
  metadataEntry,
  cardBGImages,
  categoryCards,
) {
  if (!metadataEntry || !cardBGImages || !categoryCards) {
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
export function enhanceMetadatas(metadatas, cardBGImages, categoryCards) {
  if (metadatas === undefined || metadatas.length <= 0) {
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

export function sanitizeUrls(url) {
  if (!url){
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

  if (urlsPIDValues && urlsPIDValues.length > 0) {

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
