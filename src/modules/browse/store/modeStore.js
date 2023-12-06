import {defineStore} from 'pinia';
import { MODE_STORE, modes } from '@/factories/modeFactory';


const initState = {
  modeMetadata: [],
  modeDatasets: [],
}

modes.forEach((modeMeta) => {
  initState.modeMetadata.push(modeMeta);
  initState.modeDatasets.push([]);
})

export const useModeStore = defineStore(MODE_STORE, {
  state: () => ({ ...initState }),
  getters: {
/*
    doubleCount: (state) => state.count * 2,
*/
  },
  actions: {
    getModeData(mode) {
      if (!mode) return null;

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);

      if (index >= 0) {
        return this.modeMetadata[index];
      }

      throw new Error(`No Mode Data for mode: "${mode}" implemented`);
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
      const reponse = await fetch ('./testdata/eDNA_shallowDatasets.json');
      const data = await reponse.json();

      const index = this.modeMetadata.findIndex((modeInfo) => modeInfo.name === mode);

      if (index >= 0) {
        this.modeDatasets[index] = data;
/*
        console.log('loadModeDatasets');
        console.log(data);
*/
      }

      return data;
    },
  },
})
