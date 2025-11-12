import { defineStore } from 'pinia';

import { MODE_STORE, modes } from '@/factories/modeData';

import { enhanceMetadatas, localSearch } from '@/factories/metaDataFactory';
import { getKeywordsForFiltering, tagsIncludedInSelectedTags } from '@/factories/keywordsFactory';
import { EDNA_MODE, FOREST_3D } from '@/store/metadataMutationsConsts';

const initState = {
  modeMetadata: [],
  modeDatasets: [],
  modeFilters: [],
};

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
      });
    },
    /**
     * returns the metadata object for a mode name
     * @param {string} modeName
     * @returns {*|null}
     */
    getModeMetadata(modeName) {
      if (!modeName) return null;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === modeName);

      if (index >= 0) {
        return this.modeMetadata[index];
      }

      throw new Error(`No Mode Data for mode: "${modeName}" implemented`);
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
    getFilteredDatasets(selectedTagNames = [], modeName = undefined) {
      /*
      const mergedWithHiddenNames = getSelectedTagsMergedWithHidden(mode, selectedTagNames);
      if (mergedWithHiddenNames) {
        selectedTagNames = mergedWithHiddenNames;
      }
*/

      const datasetObject = this.getDatasets(modeName);
      const content = Object.values(datasetObject);

      let filteredContent = [];
      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === modeName);

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
          this.modeFilters[index] = [];
          filteredContent = content;
        }
      } catch (e) {
        console.error('Error in getFilteredDatasets()');
        console.error(e);
      }

      return filteredContent;
    },
    getDatasets(modeName) {
      if (!modeName) return null;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === modeName);

      if (index >= 0) {
        return this.modeDatasets[index];
      }

      throw new Error(`No Mode Datasets for mode: "${modeName}" implemented`);
    },
    /**
     *
     * @param {string} modeName
     * @returns {Promise<object>} enhancedDatasetsDictionary
     */
    async loadModeDatasets(modeName) {
      const modeMetadata = this.getModeMetadata(modeName);

      const data = await modeMetadata.loadDatasets(modeMetadata);
      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === modeName);

      if (index >= 0) {
        let enhancedDatasets = data;

        if (modeName === EDNA_MODE || modeName === FOREST_3D) {
          // eDNA shallow datasets need enhancement
          const enhancedDatasetsDictionary = enhanceMetadatas(data, modeName);
          enhancedDatasets = Object.values(enhancedDatasetsDictionary);
        }

        this.modeDatasets[index] = enhancedDatasets;
      }

      return data;
    },
  },
});
