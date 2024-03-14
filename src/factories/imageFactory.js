/* eslint-disable no-use-before-define */
import { LAND, FOREST, SNOW, DIVERSITY, HAZARD, METEO } from '@/store/categoriesConsts';
import {checkIsFileAudio, checkIsFileVideo, getExtensionlessPath, getFileExtension, normalizePath} from './fileFactory';

export const imageUrlMap = import.meta.glob('@/assets/**/*.{png,jpg,jpeg,webp,WEBP,PNG,JPEG,JPG}',  { eager: true, query: '?url', import: 'default' });

/** @private */
let isWebpSupported;
/**
 * Checks to see if the browser can render webp
 * @returns {boolean} ```true``` if the browser supports webp rendering
 */
export const checkWebpSupport = () => {
    if (isWebpSupported === undefined) {
        const elem = document.createElement('canvas');
        if (!(elem.getContext && elem.getContext('2d')))
        {
            isWebpSupported = false;
            return false;
        }
        isWebpSupported = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        elem.remove();
    }
    return isWebpSupported;
}

/** Normalizes the image path so it can be used to retrieve the image, removes the 'src/asset' part of the path and also the extension */
const normalizeImagePath = (path) => normalizePath(getExtensionlessPath(path).replace(/^([/\\]?src[/\\])?assets[/\\]?/, ''));

/** Returns an image-url map from a specific sub-directory inside assets or if no directory is specified it returns all images */
export const getImages = (imageDirectory) => {
    const images = {};
    Object.keys(imageUrlMap).forEach(key => {
        if (!imageDirectory || key.includes(imageDirectory)) {
            images[normalizeImagePath(key)] = getImage(key);
        }
    });
    return images;
}

/** 
 * Gets a single specific image url from the assets directory and automatically uses the most efficient format
 */
export const getImage = (imagePath) => {
    const strippedImagePath = normalizeImagePath(getExtensionlessPath(imagePath));
    const genericImagePath = `/src/assets/${strippedImagePath}`;
    const imageExtension = getFileExtension(imagePath);

    if (checkWebpSupport()) {
        const webpUrl = imageUrlMap[`${genericImagePath}.webp`];
        if(webpUrl !== undefined) {
            return webpUrl;
        }
    }
    
    if(imageExtension){
        const imageUrl = imageUrlMap[`${genericImagePath}.${imageExtension}`];
        if(imageUrl !== undefined) {
            return imageUrl;
        }
    }

    const imagePngUrl = imageUrlMap[`${genericImagePath}.png`];
    if(imagePngUrl !== undefined) {
        return imagePngUrl;
    }

    const imageJpgUrl = imageUrlMap[`${genericImagePath}.jpg`];
    const imageJpegUrl = imageUrlMap[`${genericImagePath}.jpeg`];
    if(imageJpgUrl !== undefined || imageJpegUrl !== undefined) {
        return imageJpgUrl ?? imageJpegUrl;
    }

    return null;
}

/** 
 * Gets a specific icon-image url from the assets directory 
 * @param {string} iconName The icon name, for example ```'file'```
 */
export const getIcon = (iconName) => getImage(`icons/${iconName}`);

/**
* Loads the path to the icon image representing a file extension
*
* @param {string} fileExtension filename or extension of the file
* @return {string|null} relative file path to the icon image file
*/
export const getFileIcon = (fileExtension) => {
    const ext = getFileExtension(fileExtension) ?? fileExtension?.toLowerCase();
    if(checkIsFileAudio(ext)){
        return getIcon('fileaudio');
    }
    
    if(checkIsFileVideo(ext)){
        return getIcon('filevideo');
    }

    return getIcon(`file${ext}`) ?? getIcon('file');
};


export const imageBgs = {
    [LAND]: getImages('cards/landscape/'),
    [FOREST]: getImages('cards/forest/'),
    [SNOW]: getImages('cards/snow/'),
    [DIVERSITY]: getImages('cards/diversity/'),
    [HAZARD]: getImages('cards/hazard/'),
    [METEO]: getImages('cards/meteo/'),
}

export const swissflImages = {
    logo: getImage('modes/swissfl/logo'),
    dataset: getImage('modes/swissfl/0_data'),
    infrastructure: getImage('modes/swissfl/1_infrastructure'),
    model: getImage('modes/swissfl/2_model'),
}

export const ednaImages = {
    logo: getImage('modes/edna/edna_logo'),
    dataset: getImage('modes/edna/edna_logo'),
}