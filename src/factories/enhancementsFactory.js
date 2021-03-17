/**
 * function factory for general techncial enhancements and syntatic sugar
 *
 * @summary function for techncial enhancements and syntatic sugar
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-10-13 17:06:03 
 * Last modified  : 2020-10-29 20:32:51
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

/**
 * Return a string image path with .webp
 *
 * @export
 * @param {string} imagePath expected format is '@/modules/about/assets/team_small.jpg'
 * @param {boolean} [webpIsSupported=false]
 * @param {string} [fallbackExtension='jpg']
 */
function getWebpImagePathWithFallback(imagePath, webpIsSupported = false, fallbackExtension = 'jpg') {
  if (!imagePath) {
    return null;
  }
  
  const targetExtension = webpIsSupported ? 'webp' : fallbackExtension;

  const splits = imagePath.split('.');
  let imageNameIndex = 0;
  let prefix = '';

  if (splits.length > 0) {

    const currentExtension = splits[splits.length - 1];
    if (currentExtension === targetExtension) {
      return imagePath;
    }

    // if (splits.length === 2) {
    //   // use case @/modules/about/assets/[imagename].jpg
    //   imageNameIndex = splits.length - 1;
    // } else
    if (splits.length === 3) {
      // use case ./[imagename].jpg
      imageNameIndex = splits.length - 2;
      prefix = '.';
    } else if (splits.length === 4) {
      // use case ../modules/about/assets/[imagename].jpg
      imageNameIndex = splits.length - 2;
      prefix = '..';
    }
  }

  return `${prefix}${splits[imageNameIndex]}.${targetExtension}`;
}

// check_webp_feature:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
// according to: https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
function checkWebpFeatureAsync(feature, callback) {
  const kTestImages = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
  };
  const img = new Image();
  img.onload = () => {
    const result = (img.width > 0) && (img.height > 0);
    callback(feature, result);
  };
  img.onerror = () => {
    callback(feature, false);
  };
  img.src = `data:image/webp;base64,${kTestImages[feature]}`;
}

let webpOk = null;

// accoring to https://stackoverflow.com/questions/5573096/detecting-webp-support
function checkWebpFeature() {

  if (webpOk === null && document) {
    // simplified version in the comments, doesn't work for Firefox version 65
    // webpOk = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

    const elem = document.createElement('canvas');

    if (elem.getContext && elem.getContext('2d')) {
      // was able or not to get WebP representation
      webpOk = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
  }

  return webpOk || false;
}

/**
 * Get all files in a folder with a specific prefix. This function only works in the
 * node.js environment!
 *
 * @export
 * @param {string} path
 * @param {string} [prefix='']
 * @returns {Array} founfFiles
 */
function getFilesWithPrefix(path, prefix = '') {
  // eslint-disable-next-line global-require
  const fs = require('fs');

  const foundFiles = [];

  try {
    const files = fs.readdirSync(path);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (prefix) {
          if (f.includes(prefix)) {
            foundFiles.push(f);
          }
        } else {
          foundFiles.push(f);
        }
      }
    }  
  } catch (err) {
    console.log(`Couldn't read path: ${path}. Error: ${err}`);
  }

  return foundFiles;
}

module.exports = {
  getWebpImagePathWithFallback,
  checkWebpFeature,
  checkWebpFeatureAsync,
  getFilesWithPrefix,
};
