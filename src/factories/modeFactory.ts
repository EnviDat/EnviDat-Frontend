/**
 * function factory for methods for a specific mode.
 * Starting with a function which provides the mode specific function.
 *
 * @summary function factory for mode methods
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { createTag } from '@/factories/keywordsFactory';
import { ModeData, modes } from '@/factories/modeData';
import { Keyword } from '@/types/modelTypes';

/**
 * Get the metadata of a mode
 * @param {string} modeName
 * @returns {{externalUrl: string, datasetUrl: string, loadDatasets: (function(Object): Promise<*[]>), name: string, extrasKey: string, mainTag: {name: string, enabled: boolean}, logo: {}, title: string, icons: {infrastructure: any, model: any, dataset: any}, extraTags: [{color: string, name: string, enabled: boolean},{color: string, name: string, enabled: boolean}]}|{externalUrl: string, datasetUrl: string, loadDatasets: (function(Object): Promise<{}>), name: string, extrasKey: string, mainTag: {name: string, enabled: boolean}, logo: {}, title: string, icons: Record<string, unknown>, extraTags: *[]}}
 */
export function getModeData(modeName: string): ModeData {
  const modeData = modes.filter((m) => m.name === modeName)[0];

  if (modeData) {
    return modeData;
  }

  throw new Error(`No Mode Data for mode: "${modeName}" implemented`);
}

function mergedHiddenFilters(modeObj: ModeData, selectedTagNames: string[]) {
  const secretTags = [...selectedTagNames];

  if (!selectedTagNames.includes(modeObj.mainTag.name)) {
    secretTags.push(modeObj.mainTag.name);
  }

  return secretTags;
}

export function getSelectedTagsMergedWithHidden(modeName: string, selectedTagNames: string[]) {
  if (!modeName) return null;

  try {
    const modeObj = getModeData(modeName);
    return mergedHiddenFilters(modeObj, selectedTagNames);
  } catch (e) {
    console.error(e);
    return null;
  }
}

let tempModeData = null;

/**
 *
 * @param {string} modeName
 * @param {any} metadataEntry
 * @returns {*}
 */
export function enhanceMetadataWithModeExtras(modeName: string, metadataEntry: any) {
  if (!modeName || !metadataEntry) return metadataEntry;

  if (typeof metadataEntry.extras === 'object' && metadataEntry.extras instanceof Array) {
    if (!tempModeData || (tempModeData && tempModeData.name !== modeName)) {
      tempModeData = getModeData(modeName);
    }

    const key = tempModeData.extrasKey;

    for (let i = 0; i < metadataEntry.extras.length; i++) {
      const extra = metadataEntry.extras[i];

      if (extra.key === key) {
        metadataEntry[key] = extra.value;

        const extraTag = createTag(extra.value.toUpperCase()) as Keyword;
        const tagIndex = metadataEntry.tags.findIndex((t) => t.name === extraTag.name);

        if (tagIndex < 0) {
          metadataEntry.tags.push(extraTag);
        }
      }
    }
  }

  return metadataEntry;
}
