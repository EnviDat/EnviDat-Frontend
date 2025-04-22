import { defineStore } from 'pinia';
import axios from 'axios';

export const useDatasetWorkflowStore = defineStore({
  id: 'datasetWorkflow',
  state: () => ({
    loading: false,
    steps: [
      {
        id: 1,
        title: 'Base Information',
        description: 'Title, Description and keywords',
        isEditable: true,
        completed: false,
        key: 'baseInformation',
        genericProps: {},
        icon: 'baseinfo',
        status: 'firststep',
      },
      {
        id: 2,
        title: 'Authors',
        description: 'Authors details',
        isEditable: true,
        completed: false,
        key: 'authorinformation',
        genericProps: {},
        icon: 'authorsinfo',
        status: 'secondstep',
      },
      {
        id: 3,
        title: 'Geo Information',
        description: 'Data location and dates',
        isEditable: true,
        completed: false,
        key: 'geoinformation',
        genericProps: {},
        icon: 'geoinfo',
        status: 'thirdstep',
      },
      {
        id: 4,
        title: 'Additional Information',
        description: 'Funding and License',
        isEditable: true,
        completed: false,
        key: 'additionalinformation',
        genericProps: {},
        icon: 'additionalinfo',
        status: 'fourthstep',
      },
      {
        id: 5,
        title: 'Upload',
        description: 'Upload your resources',
        isEditable: true,
        completed: false,
        key: 'uploadinformation',
        genericProps: {},
        icon: 'uploadinfo',
        status: 'fifthstep',
      },
      {
        id: 6,
        title: 'Related Research',
        description: 'Related and interconnected research',
        isEditable: true,
        completed: false,
        key: 'relatedinformation',
        genericProps: {},
        icon: 'relatedinfo',
        status: 'sixthstep',
      },
      {
        id: 7,
        title: 'Publishing Information',
        description: 'Dataset Contact and Information',
        isEditable: true,
        completed: false,
        key: 'publicationinformation',
        genericProps: {},
        icon: 'publicationinfo',
        status: 'seventhstep',
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
