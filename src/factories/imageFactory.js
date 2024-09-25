/* eslint-disable no-use-before-define */
import {checkWebpSupport} from '@/factories/enhancementsFactory';
import {mdiLayers, mdiMapMarker, mdiMapMarkerMultiple} from '@mdi/js';
import {checkIsFileAudio, checkIsFileVideo, getFileExtension} from './fileFactory';
import {LOCATION_TYPE_MULTIPOINT, LOCATION_TYPE_POINT, LOCATION_TYPE_POLYGON} from './metadataConsts';

/** @private */
const isWebpSupported = checkWebpSupport();

/** Normalizes the image path so it can be used to retrieve the image, removes the 'src/asset' part of the path and also the extension */
/*
const normalizeImagePath = (path) => normalizePath(getExtensionlessPath(path).replace(/^([/\\]?src[/\\])?assets[/\\]?/, ''));
*/
const normalizeImagePath = (path) => {
  const splits = path.split('/');
  if (splits.length > 0) {
    const fileNameWithExt = splits[splits.length - 1];
    // return only the fileName without extensions
    return fileNameWithExt.split('.')[0];
  }

  return path;
}

const loadImageUrlMap  = () => {
  let imageUrls;

  if (isWebpSupported) {
    imageUrls = import.meta.glob('../**/*.{webp,WEBP}',
      { eager: true, query: '?url', import: 'default' });
  } else {
    imageUrls = import.meta.glob('../**/*.{jpg,jpeg,JPEG,JPG,png,PNG}',
      { eager: true, query: '?url', import: 'default' });
  }

    const keys = Object.keys(imageUrls);

    const imageMap = {};
    const iconMap = {};

    keys.forEach(key => {
      const newKey = normalizeImagePath(key);
      const imageDestination = new URL(imageUrls[key], import.meta.url).href;
      if (key.includes('assets/icons/')) {
        iconMap[newKey] = imageDestination;
      } else {
        imageMap[newKey] = imageDestination;
      }
    })

  // const imageMap = Object.keys(imageUrls).map(image => new URL(image, import.meta.url).href);
  return {
    imageMap,
    iconMap,
  };
}

const { imageMap: imageUrlMap, iconMap: iconImageUrlMap } = loadImageUrlMap();

/**
 * Gets a single specific image url from the assets directory and automatically uses the most efficient format
 */
export const getImage = (imagePath) => imageUrlMap[imagePath];

export const getImageList = (pathNeedsToInclude) => {
  const imagePaths = Object.values(imageUrlMap);
  return imagePaths.filter((path) => path.includes(pathNeedsToInclude));
}
/**
 * Gets a specific icon-image url from the assets directory
 * @param {string} iconName The icon name, for example ```'file'```
 */
export const getIcon = (iconName) => iconImageUrlMap[iconName];

/**
 * Loads the path to the icon image representing a file extension
 *
 * @param {string} fileExtension filename or extension of the file
 * @return {string|null} relative file path to the icon image file
 */
export const getFileIcon = (fileExtension) => {
  const ext = getFileExtension(fileExtension) ?? fileExtension?.toLowerCase();

  if(checkIsFileAudio(ext)){
    return 'fileaudio';
  }

  if(checkIsFileVideo(ext)){
    return 'filevideo';
  }

  const fileExt = ext ? `file${ext}` : 'file';
  return getIcon(fileExt);
};

export const getGeoJSONIcon = (type) => {
  switch(type) {
    case LOCATION_TYPE_POINT:
      return mdiMapMarker;
    case LOCATION_TYPE_MULTIPOINT:
      return mdiMapMarkerMultiple;
    case LOCATION_TYPE_POLYGON:
      return mdiLayers;
    default:
      return mdiMapMarker;
  }
}

export const swissflImages = {
  logo: getImage('swissfl_logo'),
  dataset: getImage('swissfl_0_data'),
  infrastructure: getImage('swissfl_1_infrastructure'),
  model: getImage('swissfl_2_model'),
}

export const ednaImages = {
  logo: getImage('edna_logo'),
  dataset: getImage('edna_logo'),
}
