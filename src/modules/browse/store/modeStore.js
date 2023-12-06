import {defineStore} from 'pinia';
import { MODE_STORE } from '@/factories/modeFactory';

export const useModeStore = defineStore(MODE_STORE, {
  state: () => ({
    count: 0,
    name: 'Eduardo',
  }),
  getters: {
/*
    doubleCount: (state) => state.count * 2,
*/
  },
  actions: {
/*
    getModeData(mode: string) {

    }
    */
  },
})
