import { defineStore } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { workflowSteps } from '@/modules/workflow/resources/steps';

import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel';
import { EditDatasetServiceLayer } from '@/factories/ViewModels/EditDatasetServiceLayer';

/*
import axios from 'axios';
import { set } from 'date-fns';
*/

export const useDatasetWorkflowStore = defineStore({
  id: 'datasetWorkflow',
  state: () => ({
    loading: false,
    currentStep: 0,
    steps: workflowSteps,
    datasetViewModel: new DatasetViewModel(new EditDatasetServiceLayer()),
  }),
  getters: {
    currentStepObject: (state) => state.steps[state.currentStep] ?? null,
    currentAsyncComponent(state) {
      const loader = state.steps[state.currentStep]?.loader;
      return loader ? defineAsyncComponent(loader) : null;
    },
    currentViewModel(state) {
      const step = state.steps[state.currentStep];
      if (!step?.viewModelKey) return null;

      // get the viewModel
      const vmInstance = state.datasetViewModel.getViewModel(step.viewModelKey);

      return vmInstance;
    },
  },
  actions: {
    navigateItemAction(id, status) {
      // REMOVE after testing
      // if (status === 'disabled') {
      //   return;
      // }
      this.currentStep = id;
      // REMOVE after testing
      this.steps.forEach((step) => {
        step.status = 'disabled';
        step.hasError = false;
      });
      this.steps[id].status = 'active';
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
      const vm = this.currentViewModel;

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
        this.loading = false;
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
