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

import { swissFLExtraTags, swissFLTag } from '@/modules/metadata/store/swissForestLabTags';

import {
  EDNA_MODE,
  EDNA_MODE_EXTRAS_KEY,
  METADATA_NAMESPACE,
  SWISSFL_MODE,
  SWISSFL_MODE_EXTRAS_KEY,
} from '@/store/metadataMutationsConsts';

import { ednaTag } from '@/modules/metadata/store/ednaLabTags';
import { createTag, tagsIncludedInSelectedTags } from '@/factories/keywordsFactory';

export const MODE_STORE = 'MODE_STORE';

const swissflImages = {
  logo: 'swissfl_logo',
  dataset: 'swissfl_0_data',
  infrastructure: 'swissfl_1_infrastructure',
  model: 'swissfl_2_model',
}

const ednaImages = {
  logo: 'edna_logo',
  dataset: 'edna_logo',
}

/**
 * loads the dataset specific for a mode based on the mainTag property on its modeMetadata
 *
 * @param {object} modeMetadata
 * @returns {Promise<any>}
 */
const loadModeDatasetsWithMainTag = async modeMetadata => {
  // eslint-disable-next-line import/no-cycle
  const store = await import('@/modules/metadata/store/metadataStore');
  const state = store.metadata.state;
  const isSearchResultContent = store[
    METADATA_NAMESPACE
  ].getters.searchingMetadatasContentOK(state);
  let content = [];

  if (isSearchResultContent) {
    const searchContent = store[
      METADATA_NAMESPACE
    ].getters.searchedMetadatasContent(state);

    if (Object.keys(searchContent).length > 0) {
      content = Object.values(searchContent);
    }
  } else {
    content = store[METADATA_NAMESPACE].getters.allMetadatas(state);
  }

  return content.filter(entry =>
    tagsIncludedInSelectedTags(entry.tags, [modeMetadata.mainTag.name]),
  );
};
/**
 * loads the dataset specific for the eDNA mode based on its modeMetadata
 *
 * @param {object} modeMetadata
 * @returns {Promise<any>}
 */
const ednaFallback = async () => {
  const url = `https://s3-zh.os.switch.ch/frontend-static/modes/eDNA_datasets.json?nocache=${new Date().getTime()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const loadEDNADatasets = async modeMetadata => {
  if (modeMetadata.isShallow) {
    const url = modeMetadata.datasetUrl;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        return ednaFallback();
      }

      const data = await response.json();
      return data;
    } catch (e) {
      return ednaFallback();
    }
  }

  return loadModeDatasetsWithMainTag(modeMetadata);
};




export const modes = [
  {
    name: SWISSFL_MODE,
    title: 'Swiss Forest Lab Data',
    externalUrl: 'https://swissforestlab.wsl.ch',
    mainTag: swissFLTag,
    extraTags: swissFLExtraTags,
    logo: swissflImages.logo,
    icons: swissflImages,
    minTagAmount: 5,
    extrasKey: SWISSFL_MODE_EXTRAS_KEY,
    datasetUrl: '',
    loadDatasets: loadModeDatasetsWithMainTag,
  },
  {
    name: EDNA_MODE,
    title: 'eDNA Data',
    externalUrl:
      'https://www.wsl.ch/en/about-wsl/instrumented-field-sites-and-laboratories/laboratories/edna-laboratory/',
    mainTag: ednaTag,
    extraTags: [], // swissFLExtraTags,
    logo: ednaImages.logo,
    icons: ednaImages,
    minTagAmount: 1,
    extrasKey: EDNA_MODE_EXTRAS_KEY,
    datasetUrl: `${process.env.VITE_API_ROOT}/converters-api/edna/shallow-datasets`,
    loadDatasets: loadEDNADatasets,
    isShallow: false,
  },
];

/**
 * Get the metadata of a mode
 * @param {string} mode
 * @returns {{externalUrl: string, datasetUrl: string, loadDatasets: (function(Object): Promise<*[]>), name: string, extrasKey: string, mainTag: {name: string, enabled: boolean}, logo: {}, title: string, icons: {infrastructure: any, model: any, dataset: any}, extraTags: [{color: string, name: string, enabled: boolean},{color: string, name: string, enabled: boolean}]}|{externalUrl: string, datasetUrl: string, loadDatasets: (function(Object): Promise<{}>), name: string, extrasKey: string, mainTag: {name: string, enabled: boolean}, logo: {}, title: string, icons: Record<string, unknown>, extraTags: *[]}}
 */
export function getModeData(mode) {
  const modeData = modes.filter(m => m.name === mode)[0];

  if (modeData) {
    return modeData;
  }

  throw new Error(`No Mode Data for mode: "${mode}" implemented`);
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

/**
 *
 * @param {string} mode
 * @param {object} metadataEntry
 * @returns {*}
 */
export function enhanceMetadataWithModeExtras(mode, metadataEntry) {
  if (!mode || !metadataEntry) return metadataEntry;

  if (typeof metadataEntry.extras === 'object'
    && metadataEntry.extras instanceof Array) {

    if (!tempModeData || (tempModeData && tempModeData.name !== mode)) {
      tempModeData = getModeData(mode);
    }

    const key = tempModeData.extrasKey;

    for (let i = 0; i < metadataEntry.extras.length; i++) {
      const extra = metadataEntry.extras[i];

      if (extra.key === key) {
        metadataEntry[key] = extra.value;

        const extraTag = createTag(extra.value.toUpperCase());
        const tagIndex = metadataEntry.tags.findIndex(t => t.name === extraTag.name);

        if (tagIndex < 0) {
          metadataEntry.tags.push(extraTag);
        }
      }
    }
  }

  return metadataEntry;
}
