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

import seedrandom from 'seedrandom';
import { parse, format, formatISO } from 'date-fns';

import {
  getAuthorName,
  getAuthorsString,
} from '@/factories/authorFactory';

import {
  FOREST,
  SNOW,
  LAND,
  HAZARD,
  DIVERSITY,
  METEO,
} from '@/store/categoriesConsts';

import localIdProperty from '@/factories/strategyFactory';


/**
 * Create a psyeudo random integer based on a given seed using the 'seedrandom' lib.
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

    switch (name) {
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
 * @return {String} Returns a date string containing the date and hours:minutes:seconds
 */
export function formatDate(date, inputFormat = 'yyyy-MM-dd') {
  // expecting a format like 2017-08-15T15:25:45.175790
  let formatedDate = '';

  if (date) {
    const split = date.split('T');
    if (split.length > 0) {
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
    maintainer = JSON.parse(dataset.maintainer);
  }

  let contactEmail = dataset.maintainer_email;
  if (!dataset.maintainer_email && maintainer) {
    contactEmail = maintainer.email ? maintainer.email : '';
  }

  const license = createLicense(dataset);

  let authors = null;

  if (typeof dataset.author === 'string') {
    authors = JSON.parse(dataset.author);
  }

  return {
    metadataTitle: dataset.title,
    doi: dataset.doi,
    contactName: maintainer ? getAuthorName(maintainer) : '',
    contactEmail,
    license: license.title,
    tags: dataset.tags,
    titleImg: dataset.titleImg,
    maxTags: smallScreen ? 5 : 12,
    authors,
    authorDeadInfo,
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

export function createFunding(dataset) {
  if (!dataset) {
    return null;
  }

  if (typeof dataset.funding === 'string') {
    try {
      const funding = JSON.parse(dataset.funding);
      return funding;
    } catch (e) {
      console.log(`Error JSON Parse of Funding: ${e}`);
    }
  }

  return dataset.funding;
}

export function createCitation(dataset) {
  if (!dataset) {
    return null;
  }

  const authors = getAuthorsString(dataset);

  let { publication } = dataset;

  if (typeof dataset.publication === 'string') {
    publication = JSON.parse(dataset.publication);
  }

  let text = `${authors.trim()} `;

  if (publication && publication.publication_year) {
    text += `(${publication.publication_year}). `;
  }

  text += `${dataset.title}. `;

  if (publication && publication.publisher) {
    text += ` ${publication.publisher}. `;
  }

  if (dataset.doi) {
    text += ` doi: <a href="https://www.doi.org/${dataset.doi}" target="_blank">${dataset.doi}</a>. `;
  }

  const domain = process.env.VUE_APP_ENVIDAT_PROXY;

  return {
    id: dataset.id,
    citationText: text,
    citationXmlLink: `${domain}/dataset/${dataset.name}/export/datacite.xml`,
    citationIsoXmlLink: `${domain}/dataset/${dataset.name}/export/iso19139.xml`,
    citationGCMDXmlLink: `${domain}/dataset/${dataset.name}/export/gcmd_dif.xml`,
    citationBibtexXmlLink: `${domain}/dataset/${dataset.name}/export/bibtex.bib`,
    citationRisXmlLink: `${domain}/dataset/${dataset.name}/export/ris.ris`,
  };
}

export function getFileFormat(file) {
  let fileFormat = '';
  let fileName = '';

  if (typeof file === 'object' && !!file.format) {
    // if the input is a resource object
    fileName = file.format ? file.format : '';
  } else if (typeof file === 'object') {
    fileName = file.name ? file.name : '';
  } else if (typeof file === 'string') {
    fileName = file;
  }

  const splits = fileName.split('.');
  const last = splits[splits.length - 1];
  if (last?.length > 4) {
    fileFormat = 'url';
  } else {
    fileFormat = last;
  }

  fileFormat = fileFormat.toLowerCase();

  return fileFormat;
}

let localResoureID = 0;

export function initializeLocalResource(metadataId, file = null, url = '') {

  const isLink = !!url;
  const resourceFormat = getFileFormat(isLink ? url : file);
  let resourceName = isLink ? url : file.name;
  const fileName = isLink ? '' : file.name;
  const size = !isLink ? file.size : '';

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

export function createLocalResource(metadataId, name, description, file, fileFormat = '', size = 0, url = '', doi = '', restricted = false) {

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

  if (resource.restricted && typeof resource.restricted === 'string'
      && resource.restricted.length > 0) {

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

  if (isProtected || (typeof restrictedUsers === 'boolean' && restrictedUsers === true)) {
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

  const domain = process.env.VUE_APP_ENVIDAT_PROXY;

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
    name: resource.name,
    url: resURL,
    restrictedUrl: `${domain}/dataset/${datasetName}/resource/${resource.id}`,
    restricted: resource.restricted ? resource.restricted : '',
    format: fileFormat,
    state: resource.state ? resource.state : '',
    created,
    lastModified: modified,
    position: resource.position ? resource.position : '',
    revisionId: resource.revision_id ? resource.revision_id : '',
    isProtected,
  };

}

export function createResources(dataset) {
  if (!dataset) {
    return null;
  }

  const resources = [];

  let { maintainer } = dataset;

  if (typeof (dataset.maintainer) === 'string') {
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

export function createDetails(dataset) {
  if (!dataset) {
    return null;
  }

  const details = [];

  details.push({ label: 'Title', text: dataset.title });

  const authors = getAuthorsString(dataset);
  details.push({ label: 'Authors', text: authors });

  // TODO DataCRedit

  details.push({ label: 'DOI', text: dataset.doi, url: `https://doi.org/${dataset.doi}` });


  const created = formatDate(dataset.metadata_created);
  details.push({ label: 'Created', text: created });

  const modified = formatDate(dataset.metadata_modified);
  details.push({ label: 'Last Modified', text: modified });

  const license = createLicense(dataset);
  details.push({ label: 'License', text: license.title, url: license.url });

  details.push({ label: 'MetadataId', text: dataset.id });

  if (dataset.swissFL_type) {
    details.push({ label: 'swissFL_type', text: dataset.swissFL_type });
  }

  return details;
}

function getPolygonPointArray(coordinates) {
  const points = [];

  for (let i = 0; i < coordinates.length; i++) {
    const pointElement = coordinates[i];
    const pointObject = [];

    for (let j = 0; j < pointElement.length; j++) {
      const coord = pointElement[j];
      pointObject.push([coord[1], coord[0]]);
    }

    points.push(pointObject);
  }

  return points;
}

function getMultiPointArray(coordinates) {
  const points = [];

  for (let i = 0; i < coordinates.length; i++) {
    const pointElement = coordinates[i];
    const pointObject = [pointElement[1], pointElement[0]];
    points.push(pointObject);
  }

  return points;
}

export const LOCATION_TYPE_POINT = 'Point';
export const LOCATION_TYPE_MULTIPOINT = 'MultiPoint';
export const LOCATION_TYPE_POLYGON = 'Polygon';

export function createLocation(dataset) {
  if (!dataset) {
    return null;
  }

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
    
    let spatialJSON = null;
    try {
      spatialJSON = JSON.parse(dataset.spatial);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`MetaDataFactory: geojson parsing error ${error}`);
    }

    if (spatialJSON) {
      location.geoJSON = spatialJSON;
      location.isPolygon = spatialJSON.type === LOCATION_TYPE_POLYGON;
      location.isPoint = spatialJSON.type === LOCATION_TYPE_POINT;
      location.isMultiPoint = spatialJSON.type === LOCATION_TYPE_MULTIPOINT;

      // Swap lngLat to latLng because the geoJOSN from CKAN might be invalid!

      if (location.isPoint) {
        // swap coords for the leaflet map
        location.pointArray = [spatialJSON.coordinates[1], spatialJSON.coordinates[0]];
      } else if (location.isPolygon) {
        location.pointArray = getPolygonPointArray(spatialJSON.coordinates);

      } else if (location.isMultiPoint) {
        location.pointArray = getMultiPointArray(spatialJSON.coordinates);
      }
    }
  }

  return location;
}

export function convertTags(tagsStringArray, tagsEnabled) {
  const tagObjs = [];

  tagsStringArray.forEach((element) => {
    tagObjs.push({ name: element, enabled: tagsEnabled });
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

/**
 * @param {Object} metadata
 * @param {Array} cardBGImages
 *
 * @return {Object} metadata entry enhanced with a title image based on its tags
 */
export function enhanceTitleImg(metadata, cardBGImages, categoryCards) {
  if (!metadata || !categoryCards) {
    return null;
  }

  /* eslint-disable no-param-reassign */
  const category = guessTagCategory(metadata.tags);

  if (cardBGImages) {
    const categoryImgs = cardBGImages[category];
    const max = Object.keys(categoryImgs).length - 1;
    const randomIndex = randomInt(0, max, metadata.title);
    const cardImg = randomIndex >= 0 ? Object.values(categoryImgs)[randomIndex] : 0;

    metadata.titleImg = cardImg;
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
export function enhanceMetadataEntry(metadataEntry, cardBGImages, categoryCards) {
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
