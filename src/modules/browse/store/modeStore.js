import { defineStore } from 'pinia';
import mainCategoryTags from '@/modules/metadata/store/metadataTags';

import {
  getTagsMergedWithExtras,
  // getSelectedTagsMergedWithHidden,
  MODE_STORE,
  modes,
} from '@/factories/modeFactory';

import { enhanceMetadatas, localSearch } from '@/factories/metaDataFactory';
import { getEnabledTags, getPopularTags, tagsIncludedInSelectedTags } from '@/factories/metadataFilterMethods';
import { EDNA_MODE } from '@/store/metadataMutationsConsts';

const initState = {
  modeMetadata: [],
  modeDatasets: [],
  modeFilters: [],
}

/*
const getters = [];
*/

modes.forEach((modeMeta) => {
  initState.modeMetadata.push(modeMeta);
  initState.modeDatasets.push({});
  initState.modeFilters.push([]);
})



export const useModeStore = defineStore(MODE_STORE, {
  state: () => ({ ...initState }),
/*
  getters: {
    doubleCount: (state) => state.count * 2,
  },
*/
  actions: {
    /**
     * returns the metadata object for a mode name
     * @param {string} mode
     * @returns {*|null}
     */
    getModeMetadata(mode) {
      if (!mode) return null;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);

      if (index >= 0) {
        return this.modeMetadata[index];
      }

      throw new Error(`No Mode Data for mode: "${mode}" implemented`);
    },
    searchModeDatasets(parameter, mode) {
      // get filtered datasets based on the selected tags
      // then narrow down the list via local text search
      let results = [];
      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);
      const currentFilteredKeywords = this.modeFilters[index];

      const filteredContent = this.getFilteredDatasets(currentFilteredKeywords, mode);

      if (parameter ) {
        results = localSearch(parameter, filteredContent)
      }

      return results;
    },
    getModeKeywords(mode) {
      if (!mode) return null;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);
      const metaData = this.modeMetadata[index];
      const currentFilteredKeywords = this.modeFilters[index];

      const filteredContent = this.getFilteredDatasets(currentFilteredKeywords, mode);
      let allWithExtras = [];

      const mergedExtraTags = getTagsMergedWithExtras(mode, mainCategoryTags, metaData);

      if (mergedExtraTags) {
        const popularTags = getPopularTags(filteredContent, metaData.mainTag.name, 5, filteredContent.length);
        const mergedWithPopulars = [...mergedExtraTags, ...popularTags.slice(0, 15)];

        const mergedWithoutDublicates = mergedWithPopulars.filter((item, pos, self) => self.findIndex(v => v.name === item.name) === pos);
        // tags with the same count as the content have no use, remove them
        // allWithExtras = mergedWithoutDublicates.filter((item) => { item.count >= filteredContent.length});
        allWithExtras = mergedWithoutDublicates;
      } else {
        allWithExtras = mainCategoryTags;
      }

      const updatedTags = getEnabledTags(allWithExtras, filteredContent);

      return updatedTags;
    },
    getFilteredDatasets(selectedTagNames = [], mode = undefined) {

/*
      const mergedWithHiddenNames = getSelectedTagsMergedWithHidden(mode, selectedTagNames);
      if (mergedWithHiddenNames) {
        selectedTagNames = mergedWithHiddenNames;
      }
*/

      const datasetObject = this.getDatasets(mode);
      const content = Object.values(datasetObject);
      let filteredContent = [];
      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);
      try {

        if (selectedTagNames.length > 0) {
          this.modeFilters[index] = selectedTagNames;
          for (let i = 0; i < content.length; i++) {
            const entry = content[i];

            if (tagsIncludedInSelectedTags(entry.tags, selectedTagNames)) {
              filteredContent.push(entry);
            }
          }
        } else {
          this.modeFilters[index] = []
          filteredContent = content;
        }
      } catch (e) {
        console.error('Error in getFilteredDatasets()');
        console.error(e)
      }

      return filteredContent;
    },
    getDatasets(mode) {
      if (!mode) return null;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);

      if (index >= 0) {
        return this.modeDatasets[index];
      }

      throw new Error(`No Mode Datasets for mode: "${mode}" implemented`);
    },
    /**
     *
     * @param {string} mode
     * @returns {Promise<object>} enhancedDatasetsDictionary
     */
    async loadModeDatasets(mode) {

      const modeMetadata = this.getModeMetadata(mode);
      const data = await modeMetadata.loadDatasets(modeMetadata);

      let datasets = data;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);
      if (index >= 0) {
        if (mode === EDNA_MODE) {
          // eDNA shallow datasets need enhancement
          const enhancedDatasetsDictionary = enhanceMetadatas(data, mode);
          datasets = Object.values(enhancedDatasetsDictionary);
        }

        this.modeDatasets[index] = datasets;
      }

      return datasets;
    },
  },
})
