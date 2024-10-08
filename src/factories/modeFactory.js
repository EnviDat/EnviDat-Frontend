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
import swissflLogo from '@/assets/modes/swissfl/logo.jpg';
import globalMethods from '@/factories/globalMethods';
import {
  swissFLExtraTags,
  swissFLTag,
} from '@/modules/metadata/store/swissForestLabTags';
import {
  EDNA_MODE,
  EDNA_MODE_EXTRAS_KEY,
  METADATA_NAMESPACE,
  SWISSFL_MODE,
  SWISSFL_MODE_EXTRAS_KEY,
} from '@/store/metadataMutationsConsts';
import ednaLogo from '@/assets/modes/edna/edna_logo.jpg';
import { ednaTag } from '@/modules/metadata/store/ednaLabTags';
import {
  createTag,
  tagsIncludedInSelectedTags,
} from '@/factories/keywordsFactory';

export const MODE_STORE = 'MODE_STORE';

function getSwissflIcons() {
  // use the relative path to the assets, because it will run in unit tests
  const swissflPngs = require.context(
    '@/assets/modes/swissfl',
    false,
    /\.png$/,
  );
  const iconImgs = globalMethods.methods.mixinMethods_importImages(swissflPngs);
  // const swissflPngs = import.meta.glob('../assets/modes/swissfl/*.png', { eager: true });
  // const iconImgs = globalMethods.methods.mixinMethods_importGlobImages(swissflPngs);

  const icons = Object.values(iconImgs);
  return {
    dataset: icons[0],
    infrastructure: icons[1],
    model: icons[2],
  };
}

function getEDNAIcons() {
  return {
    dataset: ednaLogo,
  };
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
    title: 'Swiss Forest Lab',
    externalUrl: 'https://swissforestlab.wsl.ch',
    mainTag: swissFLTag,
    extraTags: swissFLExtraTags,
    minTagAmount: 5,
    logo: swissflLogo,
    icons: getSwissflIcons(),
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
    minTagAmount: 1,
    logo: ednaLogo,
    icons: getEDNAIcons(),
    extrasKey: EDNA_MODE_EXTRAS_KEY,
    datasetUrl: 'https://envidat.ch/converters-api/edna/shallow-datasets',
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
 * @param {object} metdataEntry
 * @returns {*}
 */
export function enhanceMetadataWithModeExtras(mode, metdataEntry) {
  if (!mode || !metdataEntry) return metdataEntry;

  if (
    typeof metdataEntry.extras === 'object' &&
    metdataEntry.extras instanceof Array
  ) {
    if (!tempModeData || (tempModeData && tempModeData.name !== mode)) {
      tempModeData = getModeData(mode);
    }

    const key = tempModeData.extrasKey;

    for (let i = 0; i < metdataEntry.extras.length; i++) {
      const extra = metdataEntry.extras[i];

      if (extra.key === key) {
        metdataEntry[key] = extra.value;

        const extraTag = createTag(extra.value.toUpperCase());
        const tagIndex = metdataEntry.tags.findIndex(
          t => t.name === extraTag.name,
        );

        if (tagIndex < 0) {
          metdataEntry.tags.push(extraTag);
        }
      }
    }
  }

  return metdataEntry;
}
