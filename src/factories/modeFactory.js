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
  FOREST_3D,
  FOREST_3D_URL,
  FOREST_3D_EXTRAS_KEY,
} from '@/store/metadataMutationsConsts';

import { ednaTag } from '@/modules/metadata/store/ednaLabTags';
import { forest3dTags } from '@/modules/metadata/store/forest3dTags';
import {
  createTag,
  tagsIncludedInSelectedTags,
} from '@/factories/keywordsFactory';

export const MODE_STORE = 'MODE_STORE';

const swissflImages = {
  logo: 'swissfl_logo',
  dataset: 'swissfl_0_data',
  infrastructure: 'swissfl_1_infrastructure',
  model: 'swissfl_2_model',
};

const ednaImages = {
  logo: 'edna_logo',
  dataset: 'edna_logo',
};

const forest3dImages = {
  logo: 'forest3d_logo',
  dataset: 'forest3d_logo',
};

/**
 * loads the dataset specific for a mode based on the mainTag property on its modeMetadata
 *
 * @param {object} modeMetadata
 * @returns {Promise<any>}
 */
const loadModeDatasetsWithMainTag = async (modeMetadata) => {
  // eslint-disable-next-line import/no-cycle
  const store = await import('@/modules/metadata/store/metadataStore');
  const state = store.metadata.state;
  const isSearchResultContent =
    store[METADATA_NAMESPACE].getters.searchingMetadatasContentOK(state);
  let content = [];

  if (isSearchResultContent) {
    const searchContent =
      store[METADATA_NAMESPACE].getters.searchedMetadatasContent(state);

    if (Object.keys(searchContent).length > 0) {
      content = Object.values(searchContent);
    }
  } else {
    content = store[METADATA_NAMESPACE].getters.allMetadatas(state);
  }
  return content.filter((entry) =>
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

const loadEDNADatasets = async (modeMetadata) => {
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
const normalizeTags = (tags) =>
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

const loadFOREST3DDataset = async (modeMetadata) => {
  if (!modeMetadata) return [];
  const url = modeMetadata.datasetUrl;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        'loadFOREST3DDataset: bad response',
        response.status,
        response.statusText,
      );
      return [];
    }

    const testJson = [
      {
        id: '000011',
        name: 'FP11',
        title: 'FP11',
        doi: '10.16904/forest3d.000011',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4519, 47.3621] },
        tags: [
          { name: 'leafon' },
          { name: 'timeseries' },
          { name: 'evergreen' },
          { name: 'canopy' },
          { name: 'understory' },
          { name: 'biodiversity' },
          { name: 'phenology' },
          { name: 'lidar' },
          { name: 'pointcloud' },
          { name: 'mixed-stand' },
          { name: 'swiss-forest' },
          { name: 'management' },
        ],
      },
      {
        id: '000012',
        name: 'FP12',
        title: 'FP12',
        doi: '10.16904/forest3d.000012',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4523, 47.3614] },
        tags: [
          { name: 'deciduous' },
          { name: 'fagus' },
          { name: 'abies' },
          { name: 'oak' },
          { name: 'spruce' },
          { name: 'terrain' },
          { name: 'slope' },
          { name: 'north-facing' },
          { name: 'leaf-area-index' },
          { name: 'dbh' },
          { name: 'height-model' },
          { name: 'stem-mapping' },
        ],
      },
      {
        id: '000013',
        name: 'FP13',
        title: 'FP13',
        doi: '10.16904/forest3d.000013',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4531, 47.361] },
        tags: [
          { name: 'canopy-height' },
          { name: 'gap-dynamics' },
          { name: 'saplings' },
          { name: 'understory-density' },
          { name: 'leaf-off' },
          { name: 'seasonal-change' },
          { name: 'trajectory' },
          { name: 'mobile-mapping' },
          { name: 'geojson' },
          { name: 'lv95' },
          { name: 'clip2plot' },
          { name: 'ground-filter' },
        ],
      },
      {
        id: '000014',
        name: 'FP14',
        title: 'FP14',
        doi: '10.16904/forest3d.000014',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4538, 47.362] },
        tags: [
          { name: 'broadleaf' },
          { name: 'conifer' },
          { name: 'mixed-forest' },
          { name: 'plot-monitoring' },
          { name: 'thinning' },
          { name: 'silviculture' },
          { name: 'biomass' },
          { name: 'carbon-stock' },
          { name: 'point-density' },
          { name: 'scan-trajectory' },
          { name: 'accuracy' },
          { name: 'qc' },
        ],
      },
      {
        id: '000015',
        name: 'FP15',
        title: 'FP15',
        doi: '10.16904/forest3d.000015',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4546, 47.3616] },
        tags: [
          { name: 'understory-light' },
          { name: 'canopy-cover' },
          { name: 'crown-segmentation' },
          { name: 'species-mix' },
          { name: 'forest-health' },
          { name: 'storm-damage' },
          { name: 'deadwood' },
          { name: 'regeneration' },
          { name: 'soil-moisture' },
          { name: 'microtopography' },
          { name: 'intensity' },
          { name: 'echoes' },
        ],
      },
      {
        id: '000016',
        name: 'FP16',
        title: 'FP16',
        doi: '10.16904/forest3d.000016',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4552, 47.3612] },
        tags: [
          { name: 'phenophase' },
          { name: 'growth-rings' },
          { name: 'site-index' },
          { name: 'canopy-rugosity' },
          { name: 'voxel-grid' },
          { name: 'rasterization' },
          { name: 'height-quantiles' },
          { name: 'chm' },
          { name: 'dtm' },
          { name: 'dsm' },
          { name: 'geodesy' },
          { name: 'lv95-grid' },
        ],
      },
      {
        id: '000017',
        name: 'FP17',
        title: 'FP17',
        doi: '10.16904/forest3d.000017',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.456, 47.3619] },
        tags: [
          { name: 'health-monitoring' },
          { name: 'canopy-gaps' },
          { name: 'edge-effects' },
          { name: 'bark-beetle' },
          { name: 'needle-loss' },
          { name: 'chlorophyll' },
          { name: 'plot-revisit' },
          { name: 'time-lapse' },
          { name: 'trajectory-qc' },
          { name: 'strip-alignment' },
          { name: 'ground-truth' },
          { name: 'inventory' },
        ],
      },
      {
        id: '000018',
        name: 'FP18',
        title: 'FP18',
        doi: '10.16904/forest3d.000018',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4568, 47.3623] },
        tags: [
          { name: 'allometry' },
          { name: 'crown-width' },
          { name: 'height-growth' },
          { name: 'basal-area' },
          { name: 'stand-density' },
          { name: 'competition' },
          { name: 'light-availability' },
          { name: 'sun-exposure' },
          { name: 'slope-aspect' },
          { name: 'thicket' },
          { name: 'sapling-density' },
          { name: 'gap-fraction' },
        ],
      },
      {
        id: '000019',
        name: 'FP19',
        title: 'FP19',
        doi: '10.16904/forest3d.000019',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4575, 47.362] },
        tags: [
          { name: 'canopy-closure' },
          { name: 'crown-base-height' },
          { name: 'leaf-angle' },
          { name: 'needleleaf' },
          { name: 'broadleaf-mix' },
          { name: 'understory-flora' },
          { name: 'bryophytes' },
          { name: 'coarse-woody-debris' },
          { name: 'path-network' },
          { name: 'access' },
          { name: 'survey-protocol' },
          { name: 'metadata' },
        ],
      },
      {
        id: '000020',
        name: 'FP20',
        title: 'FP20',
        doi: '10.16904/forest3d.000020',
        extras: [{ key: 'sensor', value: 'MLS' }],
        license_title: 'Creative Commons Attribution (CC-BY 4.0)',
        license_url: 'http://creativecommons.org/licenses/by/4.0/',
        spatial: { type: 'Point', coordinates: [8.4582, 47.3615] },
        tags: [
          { name: 'forest-structure' },
          { name: 'stand-age' },
          { name: 'management-unit' },
          { name: 'harvesting-history' },
          { name: 'roads' },
          { name: 'streams' },
          { name: 'riparian' },
          { name: 'habitat' },
          { name: 'biodiversity-index' },
          { name: 'monitoring' },
          { name: 'repeatability' },
          { name: 'precision' },
        ],
      },
    ];
    const data = await response.json();
    // const data = testJson;
    // console.log(data);
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

/**
 * Get the metadata of a mode
 * @param {string} mode
 * @returns {{externalUrl: string, datasetUrl: string, loadDatasets: (function(Object): Promise<*[]>), name: string, extrasKey: string, mainTag: {name: string, enabled: boolean}, logo: {}, title: string, icons: {infrastructure: any, model: any, dataset: any}, extraTags: [{color: string, name: string, enabled: boolean},{color: string, name: string, enabled: boolean}]}|{externalUrl: string, datasetUrl: string, loadDatasets: (function(Object): Promise<{}>), name: string, extrasKey: string, mainTag: {name: string, enabled: boolean}, logo: {}, title: string, icons: Record<string, unknown>, extraTags: *[]}}
 */
export function getModeData(mode) {
  const modeData = modes.filter((m) => m.name === mode)[0];

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

  if (
    typeof metadataEntry.extras === 'object' &&
    metadataEntry.extras instanceof Array
  ) {
    if (!tempModeData || (tempModeData && tempModeData.name !== mode)) {
      tempModeData = getModeData(mode);
    }

    const key = tempModeData.extrasKey;

    for (let i = 0; i < metadataEntry.extras.length; i++) {
      const extra = metadataEntry.extras[i];

      if (extra.key === key) {
        metadataEntry[key] = extra.value;

        const extraTag = createTag(extra.value.toUpperCase());
        const tagIndex = metadataEntry.tags.findIndex(
          (t) => t.name === extraTag.name,
        );

        if (tagIndex < 0) {
          metadataEntry.tags.push(extraTag);
        }
      }
    }
  }

  return metadataEntry;
}
