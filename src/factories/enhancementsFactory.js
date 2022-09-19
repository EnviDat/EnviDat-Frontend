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

import globalMethods from '@/factories/globalMethods';
import {
  SET_CARD_IMAGES,
  SET_WEBP_ASSETS,
  SET_WEBP_SUPPORT,
  UPDATE_CATEGORYCARD_IMAGES,
} from '@/store/mainMutationsConsts';

/**
 * Return a string image path with .webp
 *
 * @export
 * @param {string} imagePath expected format is '@/modules/about/assets/team_small.jpg'
 * @param {boolean} [webpIsSupported=false]
 * @param {string} [fallbackExtension='jpg']
 */
export function getWebpImagePathWithFallback(imagePath, webpIsSupported = false, fallbackExtension = 'jpg') {
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
export function checkWebpFeatureAsync(feature, callback) {
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
export function checkWebpFeature() {

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


export function loadImages(store, isSupported = false) {

  store.commit(SET_WEBP_SUPPORT, isSupported);

  const cardBGImages = globalMethods.methods.mixinMethods_getCardBackgrounds(isSupported);
  if (cardBGImages) {
    store.commit(SET_CARD_IMAGES, cardBGImages);
  }

  const webpAssetPaths = isSupported ? import.meta.glob('../assets/**/*.webp', { eager: true }) : null;
  const webpAssets = webpAssetPaths ? globalMethods.methods.mixinMethods_importGlobImages(webpAssetPaths) : null;

  const keys = Object.keys(webpAssets);
  const firstKey = keys[0];
  const first = webpAssets[firstKey];
  console.log(`loaded webpAssets ${firstKey} -> ${first}`);

  if (webpAssets) {
    store.commit(SET_WEBP_ASSETS, webpAssets);
  }

  store.commit(UPDATE_CATEGORYCARD_IMAGES);

}
