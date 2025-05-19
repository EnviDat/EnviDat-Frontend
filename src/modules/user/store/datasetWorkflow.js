import { defineStore } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { workflowSteps } from '@/modules/workflow/resources/steps';

import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel';
import { EditDatasetServiceLayer } from '@/factories/ViewModels/EditDatasetServiceLayer';

import axios from 'axios';
import { set } from 'date-fns';

export const useDatasetWorkflowStore = defineStore({
  id: 'datasetWorkflow',
  state: () => ({
    loading: false,
    currentStep: 0,
    steps: workflowSteps,
    viewModelCache: new Map(),
    datasetServiceLayer: new EditDatasetServiceLayer(),
  }),
  getters: {
    currentStepObject: (state) => state.steps[state.currentStep] ?? null,
    currentAsyncComponent(state) {
      const loader = state.steps[state.currentStep]?.loader;
      return loader ? defineAsyncComponent(loader) : null;
    },
    currentViewModel(state) {
      const step = state.steps[state.currentStep];
      if (!step || !step.viewModelLoader) {
        return null;
      }

      if (state.viewModelCache.has(step.id)) {
        return Promise.resolve(state.viewModelCache.get(step.id));
      }

      // We already have the class from steps.ts, thats why we don't need to do get getViewModel('ModelName'));

      return step.viewModelLoader().then((VMClass) => {
        const vmInstance = new VMClass(
          new DatasetViewModel(state.datasetServiceLayer),
        );
        state.viewModelCache.set(step.id, vmInstance);
        return vmInstance;
      });
    },
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
    async validateStepAction(stepId, newData) {
      this.loading = true;

      /* prendi l’istanza del VM corrente */
      const vm = await this.currentViewModel;
      if (!vm) {
        console.warn('No view‑model for this step');
        this.loading = false;
        return;
      }

      const isValid = vm.validate(newData);

      if (isValid) {
        await vm.save(newData);

        this.steps[stepId].completed = true;
        this.steps[stepId].hasError = false;
        this.steps[stepId].status = 'completed';
        this.setCurrentStepAction();
      } else {
        this.steps[stepId].hasError = true;
        this.steps[stepId].status = 'error';
      }

      this.loading = false;
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
