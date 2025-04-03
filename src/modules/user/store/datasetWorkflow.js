import { defineStore } from 'pinia';
import axios from 'axios';

export const useDatasetWorkflowStore = defineStore({
  id: 'datasetWorkflow',
  state: () => ({
    loading: false,
    steps: [
      {
        id: '1',
        title: 'Base Information',
        description: 'Title, Description and keywords',
        isEditable: true,
        completed: false,
        key: 'baseInformation',
        genericProps: {},
      },
    ],
  }),
  getters: {
    // hasOrganizations: (state) => state.organizations.length > 0,
  },
  actions: {
    // async fetchOrganizations(url, params = {}) {
    //   try {
    //     const requestUrl = urlRewrite(
    //       extractBodyIntoUrl(url, params),
    //       API_BASE,
    //       API_ROOT,
    //     );
    //     const response = await axios.get(requestUrl);
    //     return response.data.result;
    //   } catch (error) {
    //     this.error = error;
    //     throw error;
    //   }
    // },
  },
});

// creare oggetto per steps
// ogni step deve avere la validazione basasta sullo step id
// ogni step deve avere un oggetto con i dati
