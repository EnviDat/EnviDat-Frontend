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
  FOREST_3D,
  FOREST_3D_EXTRAS_KEY,
  FOREST_3D_URL,
  METADATA_NAMESPACE,
  SWISSFL_MODE,
  SWISSFL_MODE_EXTRAS_KEY,
} from '@/store/metadataMutationsConsts';

import { ednaTag } from '@/modules/metadata/store/ednaLabTags';
import { forest3dTags } from '@/modules/metadata/store/forest3dTags';
import { tagsIncludedInSelectedTags } from '@/factories/keywordsFactory';
import { Tag } from '@/types/modelTypes';

export type ModeIcons = {
  logo: string;
  dataset: string;
  infrastructure?: string;
  model?: string;
};

export const MODE_STORE = 'MODE_STORE';

const swissflImages: ModeIcons = {
  logo: 'swissfl_logo',
  dataset: 'swissfl_0_data',
  infrastructure: 'swissfl_1_infrastructure',
  model: 'swissfl_2_model',
};

const ednaImages: ModeIcons = {
  logo: 'edna_logo',
  dataset: 'edna_logo',
};

const forest3dImages: ModeIcons = {
  logo: 'forest3d_logo',
  dataset: 'forest3d_logo',
};

/**
 * loads the dataset specific for a mode based on the mainTag property on its modeMetadata
 *
 * @param {ModeData} modeMetadata
 * @returns {Promise<any>}
 */
const loadModeDatasetsWithMainTag = async (modeMetadata: ModeData): Promise<any> => {
  // eslint-disable-next-line import/no-cycle
  const store = await import('@/modules/metadata/store/metadataStore');
  const state = store.metadata.state;
  const isSearchResultContent = store[METADATA_NAMESPACE].getters.searchingMetadatasContentOK(state);
  let content = [];

  if (isSearchResultContent) {
    const searchContent = store[METADATA_NAMESPACE].getters.searchedMetadatasContent(state);

    if (Object.keys(searchContent).length > 0) {
      content = Object.values(searchContent);
    }
  } else {
    content = store[METADATA_NAMESPACE].getters.allMetadatas(state);
  }
  return content.filter((entry) => tagsIncludedInSelectedTags(entry.tags, [modeMetadata.mainTag.name]));
};

/**
 * loads the dataset specific for the eDNA mode based on its modeMetadata
 *
 * @returns {Promise<any>}
 */
const ednaFallback = async (): Promise<any> => {
  const url = `https://s3-zh.os.switch.ch/frontend-static/modes/eDNA_datasets.json?nocache=${new Date().getTime()}`;
  const response = await fetch(url);
  return await response.json();
};

const loadEDNADatasets = async (modeMetadata: ModeData): Promise<any> => {
  if (modeMetadata.isShallow) {
    const url = modeMetadata.datasetUrl;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        return ednaFallback();
      }
      const data = await response.json();

      const arr = Array.isArray(data) ? data : [data];

      const result = arr.map((entry) => ({ ...entry, showShallowCitation: false }));

      return result;
    } catch (e) {
      return ednaFallback();
    }
  }

  return loadModeDatasetsWithMainTag(modeMetadata);
};

// ASK FOREST3D team to align the tags with the other modes
const normalizeTags = (tags: Tag[]) =>
  (tags || []).map((t) => {
    const raw = t && typeof t === 'object' ? t.name : t;
    const upper = String(raw ?? '')
      .trim()
      .toUpperCase();

    return {
      display_name: upper,
      name: upper,
      state: 'active',
      vocabulary_id: null,
    };
  });

const loadFOREST3DDataset = async (modeMetadata: ModeData): Promise<any> => {
  if (!modeMetadata) return [];
  const url = modeMetadata.datasetUrl;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('loadFOREST3DDataset: bad response', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const arr = Array.isArray(data) ? data : [data];

    return arr.map((entry) => ({
      ...entry,
      tags: normalizeTags(entry.tags),
      num_resources: entry.resources.length,
    }));
  } catch (e) {
    console.error('loadFOREST3DDataset error:', e);
    return [];
  }
};

export type ModeData = {
  name: string;
  title: string;
  externalUrl?: string;
  mainTag: Tag;
  extraTags: Tag[];
  logo: string;
  icons: ModeIcons;
  minTagAmount: number;
  extrasKey: string;
  datasetUrl: string;
  loadDatasets: (modeData: ModeData) => Promise<any>;
  isShallow?: boolean;
};

export const modes: ModeData[] = [
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
  {
    name: FOREST_3D,
    title: 'Forest3D Data',
    mainTag: forest3dTags,
    extraTags: [],
    logo: forest3dImages.logo,
    icons: forest3dImages,
    minTagAmount: 1,
    extrasKey: FOREST_3D_EXTRAS_KEY,
    datasetUrl: FOREST_3D_URL,
    loadDatasets: loadFOREST3DDataset,
  },
];
