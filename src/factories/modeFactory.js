/**
 * function factory for methods for a specific mode.
 * Starting with a function which provides the mode specific function.
 *
 * @summary function factory for mode methods
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:07:03 
 * Last modified  : 2019-11-22 14:10:55
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import { createTag } from '@/factories/metadataFilterMethods';

import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';
import {
  swissFLTag,
  swissFLExtraTags,
} from '@/modules/metadata/store/swissForestLabTags';

import globalMethods from '@/factories/globalMethods';

function getSwissflLogo() {
  // use the relative path to the assets, because it will run in unit tests
  const swissflImages = require.context('../assets/modes/swissfl', false, /\.jpg$/);
  const imgLogo = globalMethods.methods.mixinMethods_importImages(swissflImages, 'logo');
  return imgLogo['./logo.jpg'];
}

function getSwissflIcons() {
  // use the relative path to the assets, because it will run in unit tests
  const swissflPngs = require.context('../assets/modes/swissfl', false, /\.png$/);
  const iconImgs = globalMethods.methods.mixinMethods_importImages(swissflPngs);
  const icons = Object.values(iconImgs);
  const swissflIconMap = {
    dataset: icons[0],
    infrastructure: icons[1],
    model: icons[2],
  };

  return swissflIconMap;
}

const swissflLogo = getSwissflLogo();
const swissflIcons = getSwissflIcons();

const swissflMode = {
  name: SWISSFL_MODE,
  title: 'Swiss Forest Lab',
  externalUrl: 'https://swissforestlab.wsl.ch',
  mainTag: swissFLTag,
  extraTags: swissFLExtraTags,
  logo: swissflLogo,
  icons: swissflIcons,
  extrasKey: 'swissFL_type',
};

export function getModeData(mode) {
  if (mode === SWISSFL_MODE) {
    return swissflMode;
  }

  throw new Error(`Not Mode Objection for mode: "${mode}" implemented`);
}


function mergedExtraTags(modeObj, tags) {
  const mergedTags = [...tags, ...modeObj.extraTags];
  const uniqueArrayOfTags = mergedTags.filter((item, pos, self) => self.findIndex(v => v.name === item.name) === pos);
  return uniqueArrayOfTags;
}

export function getTagsMergedWithExtras(mode, tags) {
  if (!mode) return null;

  try {
    const modeObj = getModeData(mode);
    return mergedExtraTags(modeObj, tags);
  } catch (e) {
    console.error(e);
    return null;
  }
}


function mergedHiddenFilters(modeObj, selectedTagNames) {
  const secretTags = [...selectedTagNames];

  if (!selectedTagNames.includes(modeObj.mainTag.name)) {
    secretTags.push(modeObj.mainTag.name);
  }

  return secretTags;
}

export function getSelectedTagsMergedWithHidden(mode, selectedTagNames) {
  if (!mode) return null;

  try {
    const modeObj = getModeData(mode);
    return mergedHiddenFilters(modeObj, selectedTagNames);
  } catch (e) {
    console.error(e);
    return null;
  }
}


let tempModeData = null;

export function enhanceMetadataFromExtras(mode, metdataEntry) {
  if (!mode || !metdataEntry) return null;

  if (typeof metdataEntry.extras === 'object'
    && metdataEntry.extras instanceof Array) {

    if (!tempModeData || (tempModeData && tempModeData.name !== mode)) {
      tempModeData = getModeData(mode);
    }

    const key = tempModeData.extrasKey;

    for (let i = 0; i < metdataEntry.extras.length; i++) {
      const extra = metdataEntry.extras[i];

      if (extra.key === key) {
        metdataEntry[key] = extra.value;

        const extraTag = createTag(extra.value.toUpperCase());
        const tagIndex = metdataEntry.tags.findIndex(t => t.name === extraTag.name);

        if (tagIndex < 0) {
          metdataEntry.tags.push(extraTag);
        }
      }
    }
  }

  return metdataEntry;
}
