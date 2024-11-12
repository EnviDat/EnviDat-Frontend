import { defineStore } from 'pinia';

import {
  MODE_STORE,
  modes,
} from '@/factories/modeFactory';

import { enhanceMetadatas, localSearch } from '@/factories/metaDataFactory';
import {
  getKeywordsForFiltering,
  tagsIncludedInSelectedTags,
} from '@/factories/keywordsFactory';
import { EDNA_MODE } from '@/store/metadataMutationsConsts';


const initState = {
  modeMetadata: [],
  modeDatasets: [],
  modeFilters: [],
}


export const useModeStore = defineStore(MODE_STORE, {
  state: () => ({ ...initState }),
/*
  getters: {
    doubleCount: (state) => state.count * 2,
  },
*/
  actions: {
    init() {

      modes.forEach((modeMeta) => {
        initState.modeMetadata.push(modeMeta);
        initState.modeDatasets.push({});
        initState.modeFilters.push([]);
      })
    },
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
    searchModeDatasets(searchTerm, mode) {
      // get filtered datasets based on the selected tags
      // then narrow down the list via local text search
      let results = [];
      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);
      const currentFilteredKeywords = this.modeFilters[index];

      const filteredContent = this.getFilteredDatasets(currentFilteredKeywords, mode);

      if (searchTerm) {
        results = localSearch(searchTerm, filteredContent);
      }

      return results;
    },
    getModeKeywords(mode) {
      if (!mode) return null;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);
      const metaData = this.modeMetadata[index];
      const currentFilteredKeywords = this.modeFilters[index];

      const filteredContent = this.getFilteredDatasets(currentFilteredKeywords, mode);
      const updatedTags = getKeywordsForFiltering(filteredContent, metaData);

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

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);
      if (index >= 0) {
        let enhancedDatasets = data;
        if (mode === EDNA_MODE) {
          // eDNA shallow datasets need enhancement
          const enhancedDatasetsDictionary = enhanceMetadatas(data, mode);
          enhancedDatasets = Object.values(enhancedDatasetsDictionary);
        }
        this.modeDatasets[index] = enhancedDatasets;
      }

      return data;
    },
  },
})
