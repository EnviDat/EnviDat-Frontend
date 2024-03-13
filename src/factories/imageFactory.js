import {checkIsFileAudio, checkIsFileVideo, getExtensionlessPath, getFileExtension} from './fileFactory';

export const imageUrlMap = import.meta.glob('@/assets/**/*.{png,jpg,jpeg,webp,WEBP,PNG,JPEG,JPG}',  { eager: true, query: '?url', import: 'default' });

/** @private */
let isWebpSupported;
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

export const getImage = (imagePath) => {
    const genericImagePath = `/src/assets/${getExtensionlessPath(imagePath).replace(/^\/?src\/assets\//g, '')}`;
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
