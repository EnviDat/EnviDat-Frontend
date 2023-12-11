import { defineStore } from 'pinia';
import mainStore from '@/store/store';

import {
  // getSelectedTagsMergedWithHidden,
  MODE_STORE,
  modes,
} from '@/factories/modeFactory';

import { enhanceMetadatas } from '@/factories/metaDataFactory';
import categoryCards from '@/store/categoryCards';
import { tagsIncludedInSelectedTags } from '@/factories/metadataFilterMethods';

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
})



export const useModeStore = defineStore(MODE_STORE, {
  state: () => ({ ...initState }),
/*
  getters: {
    doubleCount: (state) => state.count * 2,
  },
*/
  actions: {
    getModeMetadata(mode) {
      if (!mode) return null;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);

      if (index >= 0) {
        return this.modeMetadata[index];
      }

      throw new Error(`No Mode Data for mode: "${mode}" implemented`);
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

      try {

        if (selectedTagNames.length > 0) {
          for (let i = 0; i < content.length; i++) {
            const entry = content[i];

            if (tagsIncludedInSelectedTags(entry.tags, selectedTagNames)) {
              filteredContent.push(entry);
            }
          }
        } else {
          filteredContent = content;
        }
      } catch (e) {
        console.log('Error in getFilteredDatasets()');
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
    async loadModeDatasets(mode) {

      const modeMetadata = this.getModeMetadata(mode);
      const reponse = await fetch (modeMetadata.datasetUrl);
      const data = await reponse.json();

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);
      let enhancedDatasetsObject = {};

      if (index >= 0) {
        enhancedDatasetsObject = enhanceMetadatas(data, mainStore.state.cardBGImages, categoryCards, mode);
        this.modeDatasets[index] = enhancedDatasetsObject;
/*
        console.log('loadModeDatasets');
        console.log(data);
*/
      }

      return enhancedDatasetsObject;
    },
  },
})
