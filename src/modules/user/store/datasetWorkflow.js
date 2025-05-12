import { defineStore } from 'pinia';
import axios from 'axios';
import { set } from 'date-fns';

export const useDatasetWorkflowStore = defineStore({
  id: 'datasetWorkflow',
  state: () => ({
    loading: false,
    currentStep: 0,
    steps: [
      {
        id: 0,
        title: 'Base Information',
        description: 'Title, Description and keywords',
        isEditable: true,
        completed: false,
        hasError: false,
        key: 'MetadataBaseInformation',
        genericProps: {},
        icon: 'baseinfo',
        status: 'active',
        guideLines: [
          {
            element: '.navigationWorkflow',
            popover: { title: 'Title', description: 'Description' },
          },
          {
            element: '.navigationWorkflow__actions',
            popover: { title: 'Title', description: 'Description' },
          },
        ],
      },
      {
        id: 1,
        title: 'Authors',
        description: 'Authors details',
        isEditable: true,
        completed: false,
        hasError: false,
        key: 'AuthorsInformation',
        genericProps: {},
        icon: 'authorsinfo',
        status: 'disabled',
        guideLines: [
          {
            element: '.navigationWorkflow__actions',
            popover: { title: 'Title', description: 'Description' },
          },
          {
            element: '.navigationWorkflow',
            popover: { title: 'Title', description: 'Description' },
          },
        ],
      },
      {
        id: 2,
        title: 'Geo Information',
        description: 'Data location and dates',
        isEditable: true,
        completed: false,
        hasError: false,
        key: 'GeoInformation',
        genericProps: {},
        icon: 'geoinfo',
        status: 'disabled',
      },
      {
        id: 3,
        title: 'Additional Information',
        description: 'Funding and License',
        isEditable: true,
        completed: false,
        hasError: false,
        key: 'additionalinformation',
        genericProps: {},
        icon: 'additionalinfo',
        status: 'disabled',
      },
      {
        id: 4,
        title: 'Upload',
        description: 'Upload your resources',
        isEditable: true,
        completed: false,
        hasError: false,
        key: 'uploadinformation',
        genericProps: {},
        icon: 'uploadinfo',
        status: 'disabled',
      },
      {
        id: 5,
        title: 'Related Research',
        description: 'Related and interconnected research',
        isEditable: true,
        completed: false,
        hasError: false,
        key: 'relatedinformation',
        genericProps: {},
        icon: 'relatedinfo',
        status: 'disabled',
      },
      {
        id: 6,
        title: 'Publishing Information',
        description: 'Dataset Contact and Information',
        isEditable: true,
        completed: false,
        hasError: false,
        key: 'publicationinformation',
        genericProps: {},
        icon: 'publicationinfo',
        status: 'disabled',
      },
    ],
  }),
  getters: {
    currentStepObject: (state) => state.steps[state.currentStep] ?? null,
  },
  actions: {
    navigateItemAction(id, status) {
      if (status === 'disabled') {
        return;
      }
      this.currentStep = id;
    },
    setCurrentStepAction() {
      // find the next element with status != completed
      const next = this.steps.find((el) => el.status != 'completed');
      if (this.steps[next.id]) {
        this.steps[next.id].status = 'active';
        this.currentStep = next.id;
      }
    },
    validateStepAction(step) {
      this.loading = true;
      setTimeout(() => {
        console.log('validated');
        this.steps[step].completed = true;
        this.steps[step].status = 'completed';
        this.setCurrentStepAction();
        this.loading = false;
      }, 2000);
    },

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
    setCurrentGuide(step) {},
  },
});
