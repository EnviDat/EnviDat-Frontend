import { defineStore } from 'pinia';
import axios from 'axios';

const TEST_URL = 'https://envicloud.wsl.ch/edna/?prefix=ma_fr/ma_fr_eparse_2019/&max-keys=100000&delimiter=/';

export const useS3Store = defineStore({
  id: 's3Store',
  state: () => ({
    loading: false,
    contentFromS3: [],
    error: null,
  }),
  getters: {
    // hasOrganizations: (state) => state.organizations.length > 0,
    // hasUserOrganizations: (state) => state.userOrganizations.length > 0,
  },
  actions: {
    async fetchS3Content(url, params = {}) {
      try {
        const response = await axios.get(url, params);
        return response.data.result;
      } catch (error) {
        this.error = error;
        throw error;
      }
    },
  },
});
